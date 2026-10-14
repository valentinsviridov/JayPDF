import { BrandConfig } from '../../../config/brand';

export const metadata = { title: 'JayPDF Licenses and Source Code' };

export default function LicensesPage() {
  return (
    <article className="prose mx-auto max-w-3xl px-6 py-12">
      <h1>Licenses and source code</h1>
      <p>JayPDF © 2026 Valentin Sviridov. This distribution uses the GNU Affero General Public License version 3 only (AGPL-3.0-only). Paying for the Android app does not remove the rights granted by that license. JayPDF is provided without warranty to the extent permitted by applicable law.</p>
      <p>Portions derive from PDFLince © Guillermo Siesto, under the MIT License. JayPDF is independent of PDFLince.</p>
      <ul>
        <li><a href="/licenses/AGPL-3.0-only.txt">GNU AGPL version 3</a></li>
        <li><a href="/licenses/MIT-PDFLince.txt">Original PDFLince MIT notice</a></li>
        <li><a href="/licenses/NOTICE.txt">JayPDF attribution notice</a></li>
        <li><a href="/licenses/third-party.txt">Third-party licenses and notices</a></li>
        <li><a href="/build-info.json">Installed build and source revision</a></li>
        <li><a href={BrandConfig.independentRepository}>JayPDF source and release downloads</a></li>
      </ul>
      <p>The source for each published Android version, including build scripts and dependency versions, is provided with its matching release in the repository. Source download links open your browser and require internet access. License texts above are bundled and available offline in the Android app.</p>
      <p>Contact <a href={`mailto:${BrandConfig.contactEmail}`}>{BrandConfig.contactEmail}</a> for source-access questions or separate commercial licensing of JayPDF-owned code. Third-party license terms continue to apply.</p>
    </article>
  );
}
