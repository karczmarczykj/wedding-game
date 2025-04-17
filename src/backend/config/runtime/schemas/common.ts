import { Schema } from 'convict';

export interface ServerCommonSchemaInterface {
  logger: {
    level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  };
  http: {
    port: number;
    version: '1.1' | '2';
    ssl: {
      cert: string | undefined;
      key: string | undefined;
    };
  };
  domain: string;
}

export const ServerCommonSchema: Schema<ServerCommonSchemaInterface> = {
  logger: {
    level: {
      doc: 'Logging level (possible values: fatal, error, warn, info, debug, trace, silent)',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
    },
  },
  http: {
    port: {
      doc: 'The HTTP or HTTPS port the server listens',
      format: 'port',
      default: 80,
    },
    version: {
      doc: 'Version of the HTTP protocol (possible values: 1.1, 2)',
      format: ['1.1', '2'],
      default: '2',
    },
    ssl: {
      cert: {
        doc: 'Path to the SSL certificate file encoded in PEM format',
        format: 'optionalFile',
        default: undefined,
      },
      key: {
        doc: 'Path to the SSL key file encoded in PEM format',
        format: 'optionalFile',
        default: undefined,
      },
    },
  },
  domain: {
    doc: 'The domain taht server listens listens on',
    format: String,
    default: 'localhost',
  },
};
