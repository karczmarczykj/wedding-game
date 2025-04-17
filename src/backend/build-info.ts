import { logger } from '@logger';
import chalk from 'chalk';

declare const __DEVELOPMENT__: boolean;
declare const __PRODUCTION__: boolean;
declare const __TEST__: boolean;
declare const __BACKEND_SERVICES__: string[];
declare const __FRONTEND_SERVICES__: string[];


export function printBuildSettings(): void {
  let result = 'Running ';
  const ornament = '▀▄'.repeat(15);

  result += 'in ';

  if (typeof __DEVELOPMENT__ !== 'undefined' && __DEVELOPMENT__) {
    result += '͟D͟E͟V͟E͟L͟O͟P͟M͟E͟N͟T͟ mode';
  } else if (typeof __PRODUCTION__ !== 'undefined' && __PRODUCTION__) {
    result += '͟P͟R͟O͟D͟U͟C͟T͟I͟O͟N͟ mode';
  } else if (typeof __TEST__ !== 'undefined' && __TEST__) {
    result += '͟T͟E͟S͟T͟ mode';
  }

  logger.info(chalk.magenta(ornament + ' ' + result + ' ' + ornament));

  if (__BACKEND_SERVICES__.length > 0) {
    const servicesBold = __BACKEND_SERVICES__
      .map((service) => chalk.bold(service))
      .join(', ');
    logger.info(`Running backend services: ${servicesBold}`);
  }

  if (__FRONTEND_SERVICES__.length > 0) {
    const servicesBold = __FRONTEND_SERVICES__
      .map((service) => chalk.bold(service))
      .join(', ');
    logger.info(`Running frontend services: ${servicesBold}`);
  }
}
