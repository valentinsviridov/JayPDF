import { describe, expect, test } from 'bun:test';
import { PDF_FEATURE_KEYS, PDF_FEATURES, acceptsFile } from '../../../src/modules/pdf/catalog';
import { loadPdfOperation } from '../../../src/modules/pdf/registry';

describe('PDF feature catalog and lazy registry', () => {
  test('every public feature resolves exactly one matching module', async () => {
    expect(PDF_FEATURE_KEYS).toHaveLength(10);
    for (const key of PDF_FEATURE_KEYS) {
      const operation = await loadPdfOperation(key);
      expect(operation.key).toBe(key);
      expect(PDF_FEATURES[key].key).toBe(key);
    }
  });

  test('file acceptance policy is feature-owned and deterministic', () => {
    const pdf = { name: 'document.PDF', type: '' } as File;
    const image = { name: 'scan.webp', type: 'image/webp' } as File;
    expect(acceptsFile('merge', pdf)).toBe(true);
    expect(acceptsFile('repair', pdf)).toBe(true);
    expect(acceptsFile('imagesToPdf', pdf)).toBe(false);
    expect(acceptsFile('imagesToPdf', image)).toBe(true);
    expect(acceptsFile('compress', image)).toBe(false);
  });
});
