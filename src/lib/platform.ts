// The origin is local: Android serves bundled assets without network access.
export const ANDROID_ORIGIN = 'https://appassets.androidplatform.net';

export function isAndroidApp(): boolean {
  return typeof window !== 'undefined' && window.location.origin === ANDROID_ORIGIN;
}
