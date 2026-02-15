import { APP_NAME } from '../constants';

type EventType = 'page_view' | 'add_to_cart' | 'checkout_start' | 'purchase' | 'search' | 'view_item';

interface EventData {
  [key: string]: any;
}

// Mock Analytics Service - In production, this would connect to Google Analytics / Mixpanel / Segment
export const AnalyticsService = {
  logEvent: (eventName: EventType, data?: EventData) => {
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(`📊 [Analytics] ${eventName}`);
      console.log('Data:', data);
      console.log('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
    
    // Example: Save to local storage to simulate "Personalization Engine" history
    if (eventName === 'view_item' && data?.productId) {
        const history = JSON.parse(localStorage.getItem('impulse_view_history') || '[]');
        if (!history.includes(data.productId)) {
            history.unshift(data.productId);
            localStorage.setItem('impulse_view_history', JSON.stringify(history.slice(0, 10)));
        }
    }
  },

  trackPageView: (path: string) => {
    console.log(`[Analytics] Page View: ${path}`);
  }
};