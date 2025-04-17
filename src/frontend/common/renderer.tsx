import React from 'react';
import { createRoot } from 'react-dom/client';
import type client from 'webpack-hot-middleware/client';
import type { ClientOptions } from 'webpack-hot-middleware/client';

declare const __DEVELOPMENT__: boolean;

export default function renderer(rootName : string, App: React.FC) {
    document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById(rootName);

    if (!container) {
      console.error(`Cannot find root element ${rootName}`);
      return;
    }

    if (__DEVELOPMENT__) {
      const hmr = (await import('webpack-hot-middleware/client')).default as typeof client;

      // The following options allow you to reload the entire page when changes are made. 
      // HMR allows you to reload only the necessary components but this does not work correctly for css/sass/scss which are built together with Pug.
      const options : ClientOptions  = {
        reload: true
      };
      hmr.setOptionsAndConnect(options);

      hmr.subscribeAll((obj) => {
        if (obj.action === 'built')
          location.reload();
      });

      if (import.meta.webpackHot) {
        console.log('Accepting hot middleware');
        const webpackHot = import.meta.webpackHot;
        webpackHot.accept();
      }
      console.log('Running in development mode');
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>);
    } else {
      console.log('Running in production/test mode');
      const root = createRoot(container);
      root.render(<App />);
    }
  });
};
