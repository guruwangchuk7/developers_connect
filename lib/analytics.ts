/**
 * Google Analytics 4 (GA4) Utility
 * 
 * This utility centralizes all GA4 tracking logic.
 * It ensures that tracking only happens in production environments
 * and provides a consistent interface for event tracking.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag && GA_MEASUREMENT_ID) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Set User ID for cross-device tracking
export const setUserId = (userId: string | null) => {
  if (typeof window !== 'undefined' && (window as any).gtag && GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV === 'production') {
      (window as any).gtag('set', 'user_properties', {
        user_id: userId,
      });
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        user_id: userId,
      });
    } else {
      console.log(`[GA4] User ID set to: ${userId}`);
    }
  }
};

// Track custom events
// Using snake_case for event names as per GA4 best practices
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag && GA_MEASUREMENT_ID) {
    // Debug log in development if enabled
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA4 Event] Action: ${action}, Category: ${category}, Label: ${label}`, params);
    }

    // Only fire real event in production
    if (process.env.NODE_ENV === 'production') {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...params,
      });
    }
  }
};

/**
 * Common Event Helpers
 * Standardizing names to avoid scattered strings
 */

export const analytics = {
  // Navigation
  trackRouteChange: (url: string) => pageview(url),

  // Auth/Admin
  trackAdminAccess: () => trackEvent('admin_access_click', 'engagement', 'Admin Dashboard Button'),
  trackAdminLogin: (method: string) => trackEvent('login', 'auth', method, undefined, { role: 'admin' }),

  // Bookings/Actions
  trackBookingStarted: (item: string) => trackEvent('begin_checkout', 'booking', item),
  trackBookingConfirmed: (item: string, value: number) => trackEvent('purchase', 'booking', item, value),
  
  // Forms
  trackFormSubmission: (formId: string) => trackEvent('form_submission', 'conversion', formId),
  trackContactEnquiry: () => trackEvent('contact_enquiry', 'conversion', 'Contact Form'),

  // Identity
  identify: (userId: string | null) => setUserId(userId),

  // Raw Event tracking
  trackEvent: (action: string, category: string, label?: string, value?: number, params?: Record<string, any>) => 
    trackEvent(action, category, label, value, params),
};
