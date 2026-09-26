import React, { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: (errorCode?: string) => void;
          'expired-callback'?: () => void;
          theme?: 'auto' | 'light' | 'dark';
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  siteKey,
  onVerify,
  onError,
  onExpire,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const renderTurnstile = () => {
      if (isCancelled || !containerRef.current || !window.turnstile) return;

      // Clean up previous widget instance if any
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'auto',
          callback: (token: string) => {
            if (!isCancelled) onVerify(token);
          },
          'error-callback': (err) => {
            console.error('Turnstile verification error:', err);
            if (!isCancelled && onError) onError();
          },
          'expired-callback': () => {
            if (!isCancelled && onExpire) onExpire();
          },
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.error('Failed to render Turnstile widget:', err);
      }
    };

    // Ensure Turnstile script is loaded
    const scriptId = 'cloudflare-turnstile-script';
    const existingScript = document.getElementById(scriptId);

    if (window.turnstile) {
      renderTurnstile();
    } else if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderTurnstile();
      };
      document.head.appendChild(script);
    } else {
      // Script is in DOM but turnstile object not yet attached; poll briefly
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderTurnstile();
        }
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 10000);

      return () => {
        isCancelled = true;
        clearInterval(interval);
        clearTimeout(timeout);
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
        }
      };
    }

    return () => {
      isCancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey]);

  return (
    <div className={`pt-3 flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div ref={containerRef} className="my-1 min-h-[65px] flex items-center justify-center" />
      <span className="text-[10px] text-gray-400 flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-500" /> Protected by Cloudflare Turnstile CAPTCHA
      </span>
    </div>
  );
};
