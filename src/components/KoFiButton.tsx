"use client";
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, config: Record<string, string>) => void;
    };
  }
}

const KOFI_SCRIPT_ID = "kofi-overlay-widget-script";

export const KoFiButton = () => {
  useEffect(() => {
    let isMounted = true;

    const drawWidget = () => {
      if (!isMounted || !window.kofiWidgetOverlay) {
        return;
      }

      window.kofiWidgetOverlay.draw("foreveroom", {
        type: "floating-chat",
        "floating-chat.position": "left",
        "floating-chat.donateButton.text": "Support me",
        "floating-chat.donateButton.background-color": "#00bfa5",
        "floating-chat.donateButton.text-color": "#fff",
      });
    };

    const existingScript = document.getElementById(
      KOFI_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.kofiWidgetOverlay) {
        drawWidget();
      } else {
        existingScript.addEventListener("load", drawWidget, { once: true });
      }
    } else {
      const script = document.createElement("script");
      script.id = KOFI_SCRIPT_ID;
      script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
      script.async = true;
      script.addEventListener("load", drawWidget, { once: true });
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
};
