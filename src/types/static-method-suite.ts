import { BaseMochaType } from './base-mocha-function';
import { BaseStaticMethodSuite } from './base-static-method-suite';

export interface StaticMethodSuite<Class>
  extends BaseMochaType<BaseStaticMethodSuite<Class>> {}
