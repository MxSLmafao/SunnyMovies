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
    
    // Block popup attempts but allow legitimate video player popups
    window.open = (url?: string | URL, target?: string, features?: string) => {
      const urlStr = url?.toString() || '';
      
      // Allow video player related popups (fullscreen, player controls)
      if (this.isVideoPlayerPopup(urlStr, features)) {
        return this.originalWindowOpen.call(window, url, target, features);
      }
      
      console.log('🚫 Blocked popup/redirect attempt:', urlStr);
      return null;
    };

    // Block target="_blank" links
    document.addEventListener('click', this.handleLinkClick, true);
    
    // Block programmatic navigation (but allow video player navigation)
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

  private isVideoPlayerPopup(url: string, features?: string): boolean {
    // Allow fullscreen and video player related popups
    if (features && features.includes('fullscreen')) return true;
    if (url.includes('vidsrc') || url.includes('player') || url.includes('video')) return true;
    return false;
  }

  private isSuspiciousUrl(url: string): boolean {
    // Don't block video streaming domains
    const allowedDomains = ['vidsrc.net', 'vidsrc.me', 'vidsrc.to', 'embedsb.com'];
    if (allowedDomains.some(domain => url.includes(domain))) {
      return false;
    }

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
  // Override fetch to block ad requests (only if not already overridden)
  if (window.fetch.toString().includes('originalFetch')) return;
  
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const url = args[0]?.toString() || '';
    
    // Don't block video streaming requests
    if (url.includes('vidsrc') || url.includes('video') || url.includes('stream')) {
      return originalFetch.apply(window, args);
    }
    
    if (AD_DOMAINS.some(domain => url.includes(domain))) {
      console.log('🚫 Blocked ad request:', url);
      return new Response('', { status: 204 }); // Return empty response
    }
    
    return originalFetch.apply(window, args);
  };
}