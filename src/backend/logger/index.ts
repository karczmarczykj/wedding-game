import pino, { Logger } from 'pino';
import { staticConfig } from '@config';

export const logger: Logger = pino(staticConfig.pinoOptions) as Logger;

export type { Logger };

export function destroy(done: () => void): void {
  if (logger.flush) {
    logger.flush(done);
  } else {
    done();
  }
}
