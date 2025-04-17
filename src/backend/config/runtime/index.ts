import { schemaFormats } from '@config-runtime/formats';
import {
  ServerApiSchema,
  ServerApiSchemaInterface,
} from '@config-runtime/schemas/server-api';
import { staticConfig } from '@config';
import { logger } from '@logger';
import setupLogger from '@logger/setup';
import { validate } from '@config-runtime/validateConsistency';

import convict from 'convict';
import yaml from 'js-yaml';
import convict_format_with_validator from 'convict-format-with-validator';
import findFileUp from 'find-file-up';
import path, { dirname } from 'path';

export interface RuntimeConfiguration {
  runtime: convict.Config<ServerApiSchemaInterface>;
  paths: {
    config: string;
  };
}

async function loadRuntimeConfiguration(): Promise<RuntimeConfiguration> {
  const staticConfigFile: string = staticConfig.configFile;
  logger.info(`Searching configuration file (${staticConfigFile}) ...`);
  convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.load });
  convict.addFormats(convict_format_with_validator);
  convict.addFormats(schemaFormats);
  const config = convict<ServerApiSchemaInterface>(ServerApiSchema);
  const executableDir: string = dirname(process.argv[1]);
  const configFile = await findFileUp(staticConfig.configFile, executableDir);

  if (!configFile) {
    logger.error(
      `Cannot find configuration file ${staticConfig.configFile}, using default configuration options`
    );
    return {
      runtime: config,
      paths: {
        config: '.',
      },
    };
  }

  logger.info(`Reading configuration file: ${configFile}`);

  try {
    const runtime = config.loadFile(configFile).validate({ allowed: 'strict' });
    validate(runtime.getProperties());

    const loggerLevel = config.get('logger.level');
    setupLogger({ level: loggerLevel });

    const paths = {
      config: path.dirname(configFile),
    };

    return {
      runtime,
      paths,
    };
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      logger.error('Unknown error occurred while reading configuration file');
      logger.error(error);
      logger.info('Exiting...');
      process.exit(1);
    }
    logger.error(`Error reading configuration file: ${configFile}`);
    logger.error(error.message);
    logger.info('Exiting...');
    process.exit(1);
  }
}

const config: RuntimeConfiguration = await loadRuntimeConfiguration();

export default config;
