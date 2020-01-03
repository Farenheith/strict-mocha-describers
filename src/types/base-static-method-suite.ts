import { TestFunction } from "mocha";
export interface BaseStaticMethodSuite<Class> {
	(methodName: keyof Class, fn: (it: TestFunction) => void): void;
}
