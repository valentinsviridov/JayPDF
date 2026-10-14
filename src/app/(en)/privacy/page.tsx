import { BrandConfig } from '../../../config/brand';

export const metadata = { title: 'JayPDF Privacy Policy', description: 'How JayPDF handles documents and personal information.' };

export default function PrivacyPage() {
  return (
    <article className="prose mx-auto max-w-3xl px-6 py-12">
      <h1>JayPDF Privacy Policy</h1>
      <p>Effective September 25, 2026. JayPDF is provided by Valentin Sviridov. For privacy questions, contact <a href={`mailto:${BrandConfig.contactEmail}`}>{BrandConfig.contactEmail}</a>.</p>
      <h2>Your documents stay under your control</h2>
      <p>JayPDF processes the PDF and image files you select on your device. We do not upload your documents to a JayPDF server, collect their contents or names, or share them with advertisers. No account is required.</p>
      <h2>Android app</h2>
      <p>The Android app includes its tools, fonts, and processing code and works offline from first launch. It has no internet permission, advertising SDK, analytics, tracking identifiers, or crash-reporting SDK. It does not request access to your entire storage, contacts, location, microphone, or camera.</p>
      <p>You choose input files and output destinations using Android’s system file picker. If you select a cloud storage provider, that provider may transfer the files according to its own settings and privacy policy. Choose local device storage to keep this workflow offline.</p>
      <h2>Storage, retention, and deletion</h2>
      <p>Working documents and previews are held in memory during use. The Android app temporarily stages exports in its private cache to save large files without loading another complete copy into memory. These temporary exports are deleted after saving, cancellation, or failure, and when the app closes normally. If Android terminates the process unexpectedly, leftovers are deleted on the next launch. You can remove app data and cached exports at any time in Android Settings or by uninstalling JayPDF.</p>
      <p>Local preferences, such as your crop measurement unit, can remain on your device until you clear app data. App data is excluded from Android cloud backup and device transfer. Files you deliberately save belong to you and remain in your chosen location until you delete them there; uninstalling the app does not remove those files.</p>
      <h2>Website</h2>
      <p>The web version also processes documents locally and uses no analytics or advertising trackers. Your browser downloads application assets from the host you visit. That host may receive standard connection information, including your IP address and requested URLs, under its own hosting configuration. The website may cache application assets for offline use. Clear the site’s storage in your browser to remove its preferences and caches.</p>
      <h2>Purchases and support</h2>
      <p>Google Play handles the Android app purchase, payments, and distribution under Google’s policies. JayPDF does not receive your payment card details or require an in-app login. Google may provide the publisher with purchase/order records and aggregate store or platform diagnostics through Play Console.</p>
      <p>If you email us, we receive your email address and anything you choose to include. We use that information to answer your request and retain it only as needed for support or applicable recordkeeping obligations. Do not send sensitive documents for support. You can request deletion of support correspondence using the contact above, subject to those obligations.</p>
      <h2>External services and changes</h2>
      <p>Source-code and support links open your browser or email app only when you choose them. Those services follow their own policies. This policy applies to JayPDF; Google Play, Android, and your chosen document providers may independently process information. Updates to this policy will be published here with a new effective date.</p>
    </article>
  );
}
