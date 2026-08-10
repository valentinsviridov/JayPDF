declare module 'bun:test' {
  type MaybePromise = void | Promise<void>;

  export function describe(name: string, body: () => void): void;
  export function test(name: string, body: () => MaybePromise): void;
  export function beforeAll(body: () => MaybePromise): void;
  export function afterAll(body: () => MaybePromise): void;

  type Matchers = {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toHaveLength(expected: number): void;
    toBeCloseTo(expected: number, digits?: number): void;
    toBeGreaterThan(expected: number): void;
    toBeInstanceOf(expected: object): void;
    toMatch(expected: RegExp | string): void;
    toThrow(expected?: RegExp | string): void;
    rejects: Matchers;
  };

  export function expect(actual: unknown): Matchers;
}
