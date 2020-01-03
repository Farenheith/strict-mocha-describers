import { ClassOf } from './class-of';
export interface BaseSuiteFunction {
	<T>(service: () => T, cls: ClassOf<T>, title: keyof T, fn: () => unknown): unknown;
}
