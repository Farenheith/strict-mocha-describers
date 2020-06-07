import { StaticMethodSuite } from './static-method-suite';
import { ClassOf } from './class-of';
import { BaseMochaType } from './base-mocha-function';

export interface DescribeStaticClassBase {
  <Target, Class extends ClassOf<Target>>(
    cls: Class,
    fn: (describe: StaticMethodSuite<Class>) => void,
  ): void;
}

export interface DescribeStaticClass
  extends BaseMochaType<DescribeStaticClassBase> {}
