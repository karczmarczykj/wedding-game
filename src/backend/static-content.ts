import Koa from 'koa';
import { logger } from '@logger';
import serve from 'koa-static';
import path from 'path';
import { frontendHotMiddleware } from 'liknur-webpack';
import { getSubdomainName } from 'liknur-webpack';
import runtimeConfig from '@config-runtime';

declare const __dirname: string;

declare const __TEST_JEST__: boolean;
declare const __DEVELOPMENT__: boolean;
declare const __FRONTEND_SERVICES__: string[];
declare const __PROJECT_CONFIG_FILE__ : string;

export default async function setup(app: Koa): Promise<void> {
  const frontendServiceList = [...__FRONTEND_SERVICES__];
  logger.info(`Running frontend services: ${frontendServiceList.join(', ')}`);
  if (__TEST_JEST__) return;

  if (__DEVELOPMENT__) {
    logger.info('Running in development mode');
    const domain = runtimeConfig.runtime.get('domain');
    logger.info('Using liknur project configution file:' + __PROJECT_CONFIG_FILE__);
    await frontendHotMiddleware(app, domain, logger, __PROJECT_CONFIG_FILE__, frontendServiceList);
  } else {
    const staticContent: Record<string, ReturnType<typeof serve>> = {};
    for (const service of frontendServiceList) {
      const publicPath = path.resolve(__dirname, `../static-content/${service}`);
      logger.info(`Serving static content by ${service} from local path ${publicPath}`);
      staticContent[service] = serve(publicPath);
    }

    app.use(async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
      logger.debug(`Serving static content for ${ctx.hostname}`);
      const domain = runtimeConfig.runtime.get('domain');
      const subdomain = getSubdomainName('http://' + ctx.hostname, domain);
      if (subdomain === null) {
        logger.debug(
          `Request from ${ctx.hostname} does not match any component using domain name ${subdomain} ... continuing`
        );
        return await next();
      }

      if (subdomain === '' && 'public' in staticContent) {
        logger.debug(
          `Request from ${ctx.hostname} matches public frontend... serving`
        );
        await staticContent['public'](ctx, next);
      } else if (subdomain in staticContent) {
        logger.debug(
          `Request from ${ctx.hostname} matches component ${subdomain}... serving`
        );
        await staticContent[subdomain](ctx, next);
      } else {
        logger.warn(
          `Request from ${ctx.hostname} does not match any component... continuing`
        );
        await next();
      }
    });
  }
}
