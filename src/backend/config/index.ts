import { LoggerOptions } from 'pino';

const pinoOptions: LoggerOptions = {
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
    },
  },
};

export interface StaticConfig {
  pinoOptions: LoggerOptions;
  configFile: string;
}

export const staticConfig: StaticConfig = {
  pinoOptions,
  configFile: 'server-config.yaml',
};
