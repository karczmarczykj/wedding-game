import { printBuildSettings } from '@backend/build-info';
import { logger } from '@logger';
import app from '@backend/application';
import readCerts from '@config-runtime/certificates';
import runtimeConfig from '@config-runtime';
import staticContent from '@backend/static-content';

import chalk from 'chalk';
import http2 from 'http2';
import http from 'http';
import https from 'https';
import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import { ServerCommonSchemaInterface } from '@config-runtime/schemas/common';

await staticContent(app);

if (!runtimeConfig) {
  logger.error('Configuration cannot be initialized, exiting...');
  process.exit(1);
}

printBuildSettings();
logger.info(chalk.yellow('🚀 Server is starting...'));
logger.info(
  chalk.greenBright(
    `Server runtime configuration: \n${JSON.stringify(runtimeConfig.runtime.getProperties(), null, 2)}`
  )
);


const httpPort = runtimeConfig.runtime.get('http.port');
const domain = runtimeConfig.runtime.get('domain');

const Http2ServerCallback: (
  req: Http2ServerRequest,
  res: Http2ServerResponse
) => void = (req, res) => void app.callback()(req, res);

const HttpServerCallback: (
  req: IncomingMessage,
  res: ServerResponse
) => void = (req, res) => void app.callback()(req, res);

const printStartupMessage = (): void => {
  const protocol = runtimeConfig.runtime.get('http.ssl.cert')
    ? 'https'
    : 'http';

  const port = runtimeConfig.runtime.get('http.port');
  const protocolVersion = runtimeConfig.runtime.get('http.version');
  logger.info(
    `Server is running on ` +
      chalk.redBright(
        `${protocol}://${domain}:${port} with HTTP/${protocolVersion}`
      )
  );
};

const protocolVersion: ServerCommonSchemaInterface['http']['version'] =
  runtimeConfig.runtime.get('http.version');
if (!runtimeConfig.runtime.get('http.ssl.cert')) {
  if (protocolVersion === '1.1')
    http.createServer(HttpServerCallback).listen(httpPort, printStartupMessage);
  else if (protocolVersion === '2')
    http2
      .createServer(Http2ServerCallback)
      .listen(httpPort, printStartupMessage);
} else {
  const certs = await readCerts();
  const httpsOptions: https.ServerOptions = {
    cert: certs.content.cert,
    key: certs.content.key,
  };
  const http2Options: http2.SecureServerOptions = {
    allowHTTP1: true,
    ...certs.content,
  };
  if (protocolVersion === '1.1')
    https
      .createServer(httpsOptions, HttpServerCallback)
      .listen(httpPort, printStartupMessage);
  else if (protocolVersion === '2')
    http2
      .createSecureServer(http2Options, Http2ServerCallback)
      .listen(httpPort, printStartupMessage);
}
logger.info(`Creating HTTPS server on port ${httpPort}`);
