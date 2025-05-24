import { create } from 'zustand';

// Your existing animation constants - keep these
export const ANIMATION_CONFIG = {
  durations: {
    pageTransition: 0.3,
    menuContainer: 0.5,
    panelFade: 0.8,
    elementStagger: 0.05,
    elementFade: 0.4,
    imageScale: 0.7,
    closeButton: 0.4,
  },
  easing: {
    smooth: 'power2.inOut',
    easeOut: 'power2.out',
    easeIn: 'power2.in',
    elastic: 'expo.out',
  },
  stagger: {
    links: 0.05,
    linksReverse: 0.03,
  },
} as const;

// Your existing types - keep these
export interface SanityLogo {
  asset: any;
  alt?: string;
}

export interface SanityNav {
  logo: SanityLogo;
  companyLinks: Array<any>;
  services: Array<any> | null;
  legal: Array<any> | null;
}

export interface SanitySettings {
  contact: {
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  businessHours: {
    hours: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    yelp: string;
    tiktok: string;
    googleReviews: string;
  };
}

// Navigation store state interface
export interface NavigationState {
  // Header visibility
  isHeaderVisible: boolean;
  isNavVisible: boolean;

  // Menu state
  isMenuOpen: boolean;
  isMenuAnimating: boolean;
  shouldRenderMenu: boolean;

  // Page context
  isExperiencePage: boolean;

  // Actions
  navigationAction: (() => void) | null;

  setHeaderVisible: (visible: boolean) => void;
  setNavVisible: (visible: boolean) => void;
  openMenu: () => void;
  closeMenu: () => void;
  setMenuAnimating: (animating: boolean) => void;
  setMenuRenderState: (shouldRender: boolean) => void;
  setExperiencePage: (isExperience: boolean) => void;
  setNavigationAction: (action: (() => void) | null) => void;
  reset: () => void;
}

// Create the navigation store
export const useNavigationStore = create<NavigationState>((set, get) => ({
  // Initial state
  isHeaderVisible: false,
  isNavVisible: false,
  isMenuOpen: false,
  isMenuAnimating: false,
  shouldRenderMenu: false,
  isExperiencePage: false,
  navigationAction: null,

  // Header/Nav visibility actions
  setHeaderVisible: visible => set({ isHeaderVisible: visible }),
  setNavVisible: visible => set({ isNavVisible: visible }),

  // Menu actions with proper state management
  openMenu: () => {
    const state = get();
    if (state.isMenuAnimating || state.isMenuOpen) return;

    set({
      shouldRenderMenu: true,
      isMenuAnimating: true,
    });

    // Very short delay to ensure DOM is ready
    setTimeout(() => {
      set({
        isMenuOpen: true,
        isMenuAnimating: false,
      });
    }, 50);
  },

  closeMenu: () => {
    const state = get();
    if (state.isMenuAnimating || !state.isMenuOpen) return;

    set({
      isMenuAnimating: true,
      isMenuOpen: false,
    });
  },

  // Animation state management
  setMenuAnimating: animating => set({ isMenuAnimating: animating }),
  setMenuRenderState: shouldRender => set({ shouldRenderMenu: shouldRender }),

  // Page context
  setExperiencePage: isExperience => set({ isExperiencePage: isExperience }),

  setNavigationAction: action => set({ navigationAction: action }),

  // Reset menu state (useful for navigation)
  reset: () => {
    // Make sure main content is visible and clickable
    if (typeof window !== 'undefined') {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.opacity = '1';
        mainElement.style.pointerEvents = 'auto';
      }

      // Note: The logoMarkerStore reset is handled separately
      // in the components that use it to ensure proper synchronization
      // with navigation and experience state
    }

    // Only reset menu-related state, not header/nav visibility
    set({
      isMenuOpen: false,
      isMenuAnimating: false,
      shouldRenderMenu: false,
    });
  },
}));

// Utility function for getting link data (from your existing code)
export const getLinkData = (link: any) => {
  if (!link) return { label: '', href: '#', target: false };

  if (link._type === 'pageLink' && link.page?.slug) {
    return {
      label: link.title || '',
      href: `/${link.page.slug.current || link.page.slug}`,
      target: false,
    };
  }

  if (link._type === 'servicesLink') {
    const slug =
      link.services?.slug?.current ||
      (typeof link.services?.slug === 'string' ? link.services.slug : '');
    return {
      label: link.title || '',
      href: slug ? `/services/${slug}` : '/services',
      target: false,
    };
  }

  if (link.url) {
    return {
      label: link.title || '',
      href: link.url,
      target: link.openInNewTab || false,
    };
  }

  return { label: link.title || '', href: '#', target: false };
};
