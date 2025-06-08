// app/types/lottie.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': {
        src: string;
        background?: string;
        speed?: string;
        style?: React.CSSProperties;
        loop?: boolean;
        autoplay?: boolean;
        direction?: string;
        mode?: string;
        controls?: boolean;
      };
    }
  }
}

declare global {
  interface Window {
    customElements: {
      get(name: string): any;
      define(name: string, constructor: any, options?: any): void;
    };
  }
}

export {};