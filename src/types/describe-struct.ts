import { StaticMethodSuite } from "./static-method-suite";

export interface DescribeStructBase {
	<Struct>	(
		struct: Struct,
		description: string,
		fn: (describe: StaticMethodSuite<Struct>) => void
	): void;
}

export interface DescribeStruct extends DescribeStructBase {
	only: DescribeStructBase;
	skip: DescribeStructBase;
}
