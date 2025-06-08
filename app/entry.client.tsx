// app/entry.client.tsx
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

// Precargar Lottie de forma global (opcional)
const preloadLottie = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
    document.head.appendChild(link);
  }
};

startTransition(() => {
  preloadLottie();
  
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});