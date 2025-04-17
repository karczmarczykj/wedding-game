import { promises as fs } from 'fs';
import runtimeConfig from '@config-runtime';
import { logger } from '@logger';
import { Buffer } from 'buffer';

export interface Certificates {
  paths: {
    cert: string;
    key: string;
  };
  content: {
    cert: Buffer;
    key: Buffer;
  };
}

export default async function (): Promise<Certificates> {
  const certFile = runtimeConfig.runtime.get('http.ssl.cert');
  const keyFile = runtimeConfig.runtime.get('http.ssl.key');

  if (!certFile || !keyFile) {
    logger.error('Skipping SSL setup, no certificate or key provided');
    return {
      paths: {
        cert: '',
        key: '',
      },
      content: {
        cert: Buffer.from(''),
        key: Buffer.from(''),
      },
    };
  }

  logger.info(
    `Reading certificates files (cert file: ${certFile}, key file: ${keyFile})`
  );
  return {
    paths: {
      cert: certFile,
      key: keyFile,
    },
    content: {
      cert: await fs.readFile(certFile),
      key: await fs.readFile(keyFile),
    },
  };
}
