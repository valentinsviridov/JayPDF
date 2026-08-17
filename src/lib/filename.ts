/**
 * Formats a Date into a compact YYYYMMDD_HHMMSS timestamp (e.g. 20260818_143022)
 * for unique, chronologically sortable generated filenames.
 */
export function formatFilenameTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
}

export function stripPdfExtension(filename: string): string {
  return filename.replace(/\.pdf$/i, '');
}

export function stripFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

export interface ResolveFilenameOptions {
  operation: string;
  originalName?: string;
  index?: number;
  modeNames?: Record<string, string>;
  bundleAsZip?: boolean;
  timestamp?: string;
  extension?: string;
}

/**
 * Resolves a unique, descriptive filename for processed outputs with the pattern:
 * [originalName]_[operationName]_[timestamp].[ext]
 *
 * For indexed operations (like split parts), places the index before the JayPDF suffix:
 * e.g. [name]_part_1_JayPDF_[timestamp].pdf
 */
export function resolveGeneratedFilename({
  operation,
  originalName,
  index,
  modeNames = {},
  bundleAsZip = false,
  timestamp = formatFilenameTimestamp(),
  extension = 'pdf',
}: ResolveFilenameOptions): string {
  const basePrefix = originalName ? stripFileExtension(originalName) : '';
  const rawOperationName = modeNames[operation] || `${operation}_JayPDF`;

  let operationSegment: string;
  if (index !== undefined) {
    if (rawOperationName.endsWith('_JayPDF')) {
      const prefix = rawOperationName.slice(0, -'_JayPDF'.length);
      operationSegment = `${prefix}_${index + 1}_JayPDF`;
    } else {
      operationSegment = `${rawOperationName}_${index + 1}`;
    }
  } else {
    operationSegment = rawOperationName;
  }

  if (operation === 'pdfToImages') {
    if (bundleAsZip) {
      return basePrefix
        ? `${basePrefix}_${rawOperationName}_${timestamp}.zip`
        : `${rawOperationName}_${timestamp}.zip`;
    }
    const imgIndex = index !== undefined ? index + 1 : 1;
    return basePrefix
      ? `${basePrefix}_image_${imgIndex}_JayPDF_${timestamp}.png`
      : `jaypdf_image_${imgIndex}_${timestamp}.png`;
  }

  const ext = extension.startsWith('.') ? extension : `.${extension}`;

  if (basePrefix) {
    return `${basePrefix}_${operationSegment}_${timestamp}${ext}`;
  }

  return `${operationSegment}_${timestamp}${ext}`;
}
