// Compatibility facade for existing UI event calls. JayPDF never collects analytics.
type TrackEventOptions = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, unknown>;
};

export const isAnalyticsEnabled = () => false;
export function trackEvent(_event: TrackEventOptions): void {}
