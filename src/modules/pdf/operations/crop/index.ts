import type { BinaryInput, PdfOperationModule } from '../../core/contracts';
import { PdfModuleError, operationFailure } from '../../core/errors';
import { requireInput } from '../../core/input';
import { applyMetadata, loadPdfWithBasicValidation } from '../../core/pdf-lib';
import type { CropOptions } from './definition';

export async function cropPdfPages(
  inputs: readonly BinaryInput[],
  options: CropOptions = {},
): Promise<Uint8Array> {
  try {
    const input = requireInput(inputs, 0, 'crop');
    const pageNumbers = options.pagesToCrop ?? [];
    if (pageNumbers.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No pages to crop', { operation: 'crop' });
    }
    if (!options.cropMargins) {
      throw new PdfModuleError('INVALID_INPUT', 'No crop margins provided', { operation: 'crop' });
    }

    const visual = {
      top: Math.max(0, options.cropMargins.top ?? 0),
      right: Math.max(0, options.cropMargins.right ?? 0),
      bottom: Math.max(0, options.cropMargins.bottom ?? 0),
      left: Math.max(0, options.cropMargins.left ?? 0),
    };
    const pdfDoc = await loadPdfWithBasicValidation(
      input,
      {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
        updateMetadata: options.preserveMetadata !== false,
      },
      { autoRepairCorrupted: options.autoRepairCorrupted },
    );
    const validIndices = [...new Set(
      pageNumbers
        .map(pageNumber => pageNumber - 1)
        .filter(index => Number.isInteger(index) && index >= 0 && index < pdfDoc.getPageCount()),
    )];
    if (validIndices.length === 0) {
      throw new PdfModuleError('NO_PAGES', 'No valid page numbers provided', { operation: 'crop' });
    }

    for (const pageIndex of validIndices) {
      const page = pdfDoc.getPage(pageIndex);
      const mediaBox = page.getMediaBox();
      const rotationAngle = page.getRotation().angle;
      const rotation = ((rotationAngle % 360) + 360) % 360;
      let logical = { ...visual };

      if (rotation === 90) {
        logical = { top: visual.right, right: visual.bottom, bottom: visual.left, left: visual.top };
      } else if (rotation === 180) {
        logical = { top: visual.bottom, right: visual.left, bottom: visual.top, left: visual.right };
      } else if (rotation === 270) {
        logical = { top: visual.left, right: visual.top, bottom: visual.right, left: visual.bottom };
      }

      const width = mediaBox.width - logical.left - logical.right;
      const height = mediaBox.height - logical.top - logical.bottom;
      if (width <= 0 || height <= 0) {
        throw new PdfModuleError(
          'INVALID_INPUT',
          `Crop margins exceed page bounds on page ${pageIndex + 1}. ` +
            `Details: mediaBox=(${Math.round(mediaBox.width)}x${Math.round(mediaBox.height)}), ` +
            `rotation=${rotationAngle}, normalized=${rotation}, ` +
            `visual=(T:${Math.round(visual.top)},R:${Math.round(visual.right)},B:${Math.round(visual.bottom)},L:${Math.round(visual.left)}), ` +
            `logical=(T:${Math.round(logical.top)},R:${Math.round(logical.right)},B:${Math.round(logical.bottom)},L:${Math.round(logical.left)}), ` +
            `next=(${Math.round(width)}x${Math.round(height)})`,
          { operation: 'crop' },
        );
      }

      const x = mediaBox.x + logical.left;
      const y = mediaBox.y + logical.bottom;
      page.setMediaBox(x, y, width, height);
      page.setCropBox(x, y, width, height);
      page.setBleedBox(x, y, width, height);
      page.setTrimBox(x, y, width, height);
      page.setArtBox(x, y, width, height);
    }

    applyMetadata(pdfDoc, options.metadata);
    return pdfDoc.save({
      useObjectStreams: !pdfDoc.context.trailerInfo.Encrypt,
      addDefaultPage: false,
    });
  } catch (error) {
    throw operationFailure('crop', 'Failed to crop pages', error);
  }
}

export const cropOperation: PdfOperationModule<'crop', CropOptions, Uint8Array> = {
  key: 'crop',
  execute: cropPdfPages,
};
