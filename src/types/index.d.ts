declare module "use-modal-hook";

declare global {
  interface Window {
    TradingView: any;
  }
}

declare const TradingView = window.TradingView; // ok now

declare type RequireSome<T, K extends keyof T> = T & Required<Pick<T, K>>;

// declare const window: any;

// declare window.TradingView = {
//   name: string;
//   chainId: number;
//   ensAddress?: string;
//   _defaultProvider?: (providers: any, options?: any) => any;
// };
