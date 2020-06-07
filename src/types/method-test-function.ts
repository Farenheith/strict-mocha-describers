import { BaseMochaType } from './base-mocha-function';
import { BaseInstanceTestFunction } from './base-instance-test-function';

export interface MethodTestFunction<Target>
  extends BaseMochaType<BaseInstanceTestFunction<Target>> {}
