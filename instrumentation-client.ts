import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-05-24', // Use the latest defaults for automatic pageview and pageleave tracking
    capture_pageview: false, // Disabled since defaults: '2025-05-24' handles this automatically
    capture_pageleave: true, // Track when users leave pages
  });
}
