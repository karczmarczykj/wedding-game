import { logger } from '@logger';

export default function setupLogger({ level }: { level: string }): void {
  logger.info(`Setting up logger level: ${level}`);
  logger.level = level;
}
