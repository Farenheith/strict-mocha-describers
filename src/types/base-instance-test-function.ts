export interface BaseInstanceTestFunction<Target> {
  (
    description: string,
    callback: (target: Target) => void | PromiseLike<void>,
  ): void | PromiseLike<void>;
}
