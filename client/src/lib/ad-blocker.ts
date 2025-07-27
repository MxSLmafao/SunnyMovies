// Ad blocking and redirect prevention utilities

export class AdBlocker {
  private static instance: AdBlocker;
  private originalWindowOpen: typeof window.open;
  private isActive = false;

  constructor() {
    this.originalWindowOpen = window.open;
  }

  static getInstance(): AdBlocker {
    if (!AdBlocker.instance) {
      AdBlocker.instance = new AdBlocker();
    }
    return AdBlocker.instance;
  }

  activate(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    
    // Block all popup attempts
    window.open = () => {
      console.log('🚫 Blocked popup/redirect attempt');
      return null;
    };

    // Block target="_blank" links
    document.addEventListener('click', this.handleLinkClick, true);
    
    // Block programmatic navigation
    this.blockNavigation();
    
    // Block common ad redirect patterns
    this.blockAdRedirects();
  }

  deactivate(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    // Restore original window.open
    window.open = this.originalWindowOpen;
    
    // Remove event listeners
    document.removeEventListener('click', this.handleLinkClick, true);
  }

  private handleLinkClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'A') {
      const anchor = target as HTMLAnchorElement;
      
      // Block external links with target="_blank"
      if (anchor.target === '_blank' && anchor.href && !anchor.href.startsWith(window.location.origin)) {
        console.log('🚫 Blocked external link:', anchor.href);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      
      // Block suspicious redirect patterns
      if (this.isSuspiciousUrl(anchor.href)) {
        console.log('🚫 Blocked suspicious redirect:', anchor.href);
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }
  };

  private blockNavigation(): void {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      console.log('🚫 Blocked navigation attempt');
    };
    
    history.replaceState = (...args) => {
      console.log('🚫 Blocked navigation attempt');
    };
  }

  private blockAdRedirects(): void {
    // Intercept common ad redirect methods
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    
    window.location.assign = (url: string | URL) => {
      if (this.isSuspiciousUrl(url.toString())) {
        console.log('🚫 Blocked location.assign redirect:', url);
        return;
      }
      originalAssign.call(window.location, url);
    };
    
    window.location.replace = (url: string | URL) => {
      if (this.isSuspiciousUrl(url.toString())) {
        console.log('🚫 Blocked location.replace redirect:', url);
        return;
      }
      originalReplace.call(window.location, url);
    };
  }

  private isSuspiciousUrl(url: string): boolean {
    const suspiciousPatterns = [
      /ads?\.|advert|marketing|promo|offer|deal/i,
      /click|redirect|goto|jump|link/i,
      /casino|betting|loan|credit|crypto/i,
      /download|install|update|upgrade/i,
      /win|prize|reward|gift|free/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(url));
  }
}

// Auto-block known ad domains
export const AD_DOMAINS = [
  'googleadservices.com',
  'googlesyndication.com',
  'doubleclick.net',
  'adsystem.com',
  'amazon-adsystem.com',
  'facebook.com/tr',
  'google-analytics.com',
  'googletagmanager.com',
];

// Block requests to ad domains
export function blockAdRequests(): void {
  // Override fetch to block ad requests
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const url = args[0]?.toString() || '';
    
    if (AD_DOMAINS.some(domain => url.includes(domain))) {
      console.log('🚫 Blocked ad request:', url);
      return new Response('', { status: 204 }); // Return empty response
    }
    
    return originalFetch.apply(window, args);
  };
}