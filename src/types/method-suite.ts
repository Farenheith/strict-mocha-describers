import { ClassOf } from './class-of';
import { BaseMethodSuite } from './base-method-suite';
import { StaticMethodSuite } from './static-method-suite';
import { BaseMochaType } from './base-mocha-function';
export interface MethodSuite<Target, Class extends ClassOf<Target>>
  extends BaseMochaType<BaseMethodSuite<Target>> {
  static: StaticMethodSuite<Class>;
}
