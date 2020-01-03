import { StaticMethodSuite } from "./static-method-suite";
import { BaseMochaType } from "./base-mocha-function";

export interface DescribeStructBase {
	<Struct>	(
		struct: Struct,
		description: string,
		fn: (describe: StaticMethodSuite<Struct>) => void
	): void;
}

export interface DescribeStruct extends BaseMochaType<DescribeStructBase> {
}
