declare module 'webpack-hot-middleware/client' {
  export interface ClientOptions {
    path?: string;
    timeout?: number;
    overlay?: boolean;
    reload?: boolean;
    noInfo?: boolean;
    quiet?: boolean;
    dynamicPublicPath?: boolean;
    ansiColors?: {
      enabled: boolean;
      [color: string]: string | boolean;
    };
    name?: string;
  }

  export interface HotMiddlewareClient {
    subscribe(callback: (message: any) => void): void;
    setOptionsAndConnect(options: ClientOptions): void;
    subscribeAll(callback: (message: any) => void): void;
  }

  const client: HotMiddlewareClient;
  export default client;
}
