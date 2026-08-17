import { describe, expect, test } from "bun:test";
import { formatFilenameTimestamp, resolveGeneratedFilename } from "../../src/lib/filename";

describe("Filename Strategy", () => {
  test("formats timestamp as YYYYMMDD_HHMMSS", () => {
    const fixedDate = new Date(2026, 7, 18, 14, 30, 22); // Note: month is 0-indexed (7 = August)
    const ts = formatFilenameTimestamp(fixedDate);
    expect(ts).toBe("20260818_143022");
  });

  test("generates unique timestamped filename for single file compression", () => {
    const name = resolveGeneratedFilename({
      operation: "compress",
      originalName: "invoice_2026.pdf",
      modeNames: { compress: "compressed_JayPDF" },
      timestamp: "20260818_143022",
    });
    expect(name).toBe("invoice_2026_compressed_JayPDF_20260818_143022.pdf");
  });

  test("generates timestamped filename for split parts with part_x_JayPDF format", () => {
    const name = resolveGeneratedFilename({
      operation: "split",
      originalName: "manual.pdf",
      index: 0,
      modeNames: { split: "part_JayPDF" },
      timestamp: "20260818_143022",
    });
    expect(name).toBe("manual_part_1_JayPDF_20260818_143022.pdf");

    const multiPartName = resolveGeneratedFilename({
      operation: "split",
      originalName: "cg-brsvie-2_merged_JayPDF_20260818_011432.pdf",
      index: 9,
      modeNames: { split: "part_JayPDF" },
      timestamp: "20260818_011554",
    });
    expect(multiPartName).toBe("cg-brsvie-2_merged_JayPDF_20260818_011432_part_10_JayPDF_20260818_011554.pdf");
  });

  test("generates timestamped filename for PDF to images zip bundle", () => {
    const name = resolveGeneratedFilename({
      operation: "pdfToImages",
      originalName: "slides.pdf",
      bundleAsZip: true,
      modeNames: { pdfToImages: "images_JayPDF" },
      timestamp: "20260818_143022",
    });
    expect(name).toBe("slides_images_JayPDF_20260818_143022.zip");
  });

  test("generates timestamped filename when no original name is available", () => {
    const name = resolveGeneratedFilename({
      operation: "merge",
      modeNames: { merge: "merged_JayPDF" },
      timestamp: "20260818_143022",
    });
    expect(name).toBe("merged_JayPDF_20260818_143022.pdf");
  });
});
