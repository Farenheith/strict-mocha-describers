import { BaseMochaType } from './base-mocha-function';
import { DescribeStaticClass } from './describe-static-class';
import { MethodSuite } from "./method-suite";
import { ClassOf } from "./class-of";

export interface DescribeClassBase {
	<Target, Class extends ClassOf<Target>>	(
		cls: Class,
		bootStrapper: () => Target,
		fn: (describe: MethodSuite<Target, Class>) => void
	): void
}

export interface DescribeClass extends BaseMochaType<DescribeClassBase> {
	static: DescribeStaticClass;
}
