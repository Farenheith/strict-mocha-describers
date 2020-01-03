import { BaseStaticMethodSuite } from "./base-static-method-suite";
export interface StaticMethodSuite<Class> extends BaseStaticMethodSuite<Class> {
	only: BaseStaticMethodSuite<Class>;
	skip: BaseStaticMethodSuite<Class>;
}
