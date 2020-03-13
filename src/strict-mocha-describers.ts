import { DescribeStruct } from './types/describe-struct';
import { DescribeClass } from './types/describe-class';
export { describeClass, describeStaticClass, describeStruct } from './strict-describe-class';
export * from './get-fake';
import { describeClass, describeStruct } from './strict-describe-class';

declare global {
	export namespace Mocha {
		export interface SuiteFunction {
			class: DescribeClass;
			struct: DescribeStruct;
		}
	}
}

describe.class = describeClass;
describe.struct = describeStruct;
