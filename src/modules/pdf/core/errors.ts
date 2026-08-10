export type PdfErrorCode =
  | 'INVALID_INPUT'
  | 'NO_FILES'
  | 'NO_PAGES'
  | 'CORRUPT_PDF'
  | 'UNSUPPORTED_CAPABILITY'
  | 'WORKER_TRANSPORT'
  | 'OPERATION_FAILED';

export class PdfModuleError extends Error {
  readonly code: PdfErrorCode;
  readonly operation?: string;
  override readonly cause?: unknown;

  constructor(
    code: PdfErrorCode,
    message: string,
    options: { operation?: string; cause?: unknown } = {},
  ) {
    super(message);
    this.name = 'PdfModuleError';
    this.code = code;
    this.operation = options.operation;
    this.cause = options.cause;
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function operationFailure(operation: string, message: string, cause: unknown): PdfModuleError {
  const code = cause instanceof PdfModuleError ? cause.code : 'OPERATION_FAILED';
  return new PdfModuleError(code, `${message}: ${getErrorMessage(cause)}`, {
    operation,
    cause,
  });
}
