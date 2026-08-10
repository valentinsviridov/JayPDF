import type { BinaryInput, NamedBinarySource } from './contracts';
import { PdfModuleError } from './errors';

export function isNamedBinarySource(input: unknown): input is NamedBinarySource {
  if (!input || typeof input !== 'object') {
    return false;
  }

  const candidate = input as Partial<NamedBinarySource>;
  return typeof candidate.name === 'string' && typeof candidate.arrayBuffer === 'function';
}

export async function readBytes(input: BinaryInput): Promise<Uint8Array> {
  if (isNamedBinarySource(input)) {
    return new Uint8Array(await input.arrayBuffer());
  }

  if (input instanceof Uint8Array) {
    return input;
  }

  return new Uint8Array(input);
}

export function requireInput(
  inputs: readonly BinaryInput[],
  index: number,
  operation: string,
): BinaryInput {
  const input = inputs[index];
  if (!input) {
    throw new PdfModuleError('NO_FILES', `No input provided for ${operation}`, { operation });
  }
  return input;
}

export function requireInputs(inputs: readonly BinaryInput[], operation: string): readonly BinaryInput[] {
  if (inputs.length === 0) {
    throw new PdfModuleError('NO_FILES', `No inputs provided for ${operation}`, { operation });
  }
  return inputs;
}

export const yieldToEventLoop = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, 0));
