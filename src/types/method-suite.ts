import { ClassOf } from "./class-of";
import { BaseMethodSuite } from "./base-method-suite";
import { StaticMethodSuite } from "./static-method-suite";
export interface MethodSuite<Target, Class extends ClassOf<Target>> extends BaseMethodSuite<Target> {
	only: BaseMethodSuite<Target>;
	skip: BaseMethodSuite<Target>;
	static: StaticMethodSuite<Class>;
}
