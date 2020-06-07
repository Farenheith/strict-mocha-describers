import { DescribeStruct } from './types/describe-struct';
import { DescribeClass } from './types/describe-class';
export {
  describeClass,
  describeStaticClass,
  describeStruct,
} from './strict-describe-class';
export * from './get-fake';
export {
  fakeStaticClass as staticDummy,
  getFakeInstance as dummy,
} from './get-fake';
import { describeClass, describeStruct } from './strict-describe-class';

declare global {
  export namespace Mocha {
    export interface SuiteFunction {
      class: DescribeClass;
      struct: DescribeStruct;
    }
  }
}

global.describe.class = describeClass;
global.describe.struct = describeStruct;
