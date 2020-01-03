import { MethodTestFunction } from "../strict-it";
export interface BaseMethodSuite<Target> {
	(methodName: keyof Target, fn: (it: MethodTestFunction<Target>, getTarget: () => Target) => void): void;
}
