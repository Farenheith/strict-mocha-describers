import { StaticMethodSuite } from "./static-method-suite";
import { MethodSuite } from "./method-suite";
import { ClassOf } from "./class-of";

export interface DescribeStaticClassBase {
	<Target, Class extends ClassOf<Target>>(
		cls: Class,
		fn: (describe: StaticMethodSuite<Class>) => void
	): void;
}

export interface DescribeStaticClass extends DescribeStaticClassBase {
	only: DescribeStaticClassBase;
	skip: DescribeStaticClassBase;
}
