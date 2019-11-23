import { TestFunction } from 'mocha';
import { ClassOf } from './strict-describers';
interface BootStrapperReturn<Target, Services> {
    target: Target;
    services: Services | undefined;
}
declare type TestCaseConf = 'only' | 'skip';
declare type InstanceTests<Target, Services> = {
    [key in keyof Target]: MethodTestSuite<Target, Services>;
};
declare type StaticTests<Target> = {
    [key in keyof ClassOf<Target>]: StaticMethodTestCase<Target>;
};
export declare function mountTests<Target, Services>(cls: ClassOf<Target>, staticTests: StaticTests<Target> | undefined, bootStrapper: () => BootStrapperReturn<Target, Services>, instanceTests: InstanceTests<Target, Services>): void;
export declare function mountInstanceTests<Target, Services>(bootStrapper: () => BootStrapperReturn<Target, Services>, instanceTests: InstanceTests<Target, Services>, cls: ClassOf<Target>): void;
interface BaseInstanceTestFunction<Target, Services> {
    (description: string, callback: (target: Target, services: Services) => any): any;
}
interface InstanceTestFunction<Target, Services> extends BaseInstanceTestFunction<Target, Services> {
    only: BaseInstanceTestFunction<Target, Services>;
    skip: BaseInstanceTestFunction<Target, Services>;
}
export declare function getIt<Target, Services>(getTarget: () => Target, getServices: () => Services): InstanceTestFunction<Target, Services>;
export declare function mountTestCase<T>(getTarget: () => T, prototype: T, methodName: keyof T, callback: () => any): void;
export declare function mountStaticTests<Target>(staticTests: StaticTests<Target>, cls: ClassOf<Target>): void;
export interface MethodTestSuite<Target, Services> {
    readonly flag?: TestCaseConf;
    tests(it: InstanceTestFunction<Target, Services | undefined>): void;
}
export interface StaticMethodTestCase<Target> {
    readonly flag?: TestCaseConf;
    tests(it: TestFunction): void;
}
export declare function describeClass<Target, Services>(cls: ClassOf<Target>, bootStrapper: () => BootStrapperReturn<Target, Services>, instanceTests: InstanceTests<Target, Services>, staticTests?: StaticTests<Target>): void;
export declare namespace describeClass {
    function only<Target, Services>(cls: ClassOf<Target>, bootStrapper: () => BootStrapperReturn<Target, Services>, instanceTests: InstanceTests<Target, Services>, staticTests?: StaticTests<Target>): void;
    function skip<Target, Services>(cls: ClassOf<Target>, bootStrapper: () => BootStrapperReturn<Target, Services>, instanceTests: InstanceTests<Target, Services>, staticTests?: StaticTests<Target>): void;
}
export {};
