import { ServerCommonSchemaInterface } from '@config-runtime/schemas/common';
import convict from 'convict';

interface RuntimeConfiguration {
  runtime: convict.Config<ServerCommonSchemaInterface>;
  paths: {
    config: string;
  };
}

const filledConfig: ServerCommonSchemaInterface = {
  domain: 'localhost',
  logger: {
    level: 'info',
  },
  http: {
    port: 80,
    version: '2',
    ssl: {
      cert: undefined,
      key: undefined,
    },
  },
};

function prepareRuntimeConfig(): RuntimeConfiguration {
  const config = convict<ServerCommonSchemaInterface>(filledConfig);
  return {
    runtime: config,
    paths: {
      config: '.',
    },
  };
}

const config = prepareRuntimeConfig();
export default config;
