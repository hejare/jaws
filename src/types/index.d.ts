declare module "use-modal-hook";

declare global {
  interface Window {
    TradingView: any;
  }
}

declare const TradingView = window.TradingView; // ok now

// declare const window: any;

// declare window.TradingView = {
//   name: string;
//   chainId: number;
//   ensAddress?: string;
//   _defaultProvider?: (providers: any, options?: any) => any;
// };
