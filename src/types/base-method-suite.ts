import { MethodTestFunction } from './method-test-function';
export interface BaseMethodSuite<Target> {
  (
    methodName: keyof Target,
    fn: (it: MethodTestFunction<Target>, getTarget: () => Target) => void,
  ): void;
}
