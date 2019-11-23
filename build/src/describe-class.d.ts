import { TestFunction } from 'mocha';
import { ClassOf } from './strict-describers';
interface BootStrapperReturn<Target, Services> {
    target: Target;
    services: Services | undefined;
}
declare type TestCaseConf = 'only' | 'skip';
interface GeneralInstanceTests<Target, Services> {
    [key: string]: MethodTestSuite<Target, Services>;
}
declare type InstanceTests<Target, Services> = {
    [key in keyof Target]: MethodTestSuite<Target, Services>;
};
interface GeneralStaticTests<Target> {
    [key: string]: StaticMethodTestCase<Target>;
}
declare type StaticTests<Target> = {
    [key in keyof ClassOf<Target>]: StaticMethodTestCase<Target>;
};
export declare function mountTests<Target, Services>(cls: ClassOf<Target>, bootStrapper: () => BootStrapperReturn<Target, Services>, testSuites: TestSuites<Target, Services>): void;
export declare function mountInstanceTests<Target, Services>(bootStrapper: () => BootStrapperReturn<Target, Services>, instanceTests: GeneralInstanceTests<Target, Services>, cls: ClassOf<Target>, title: string, prepare: boolean): void;
interface BaseInstanceTestFunction<Target, Services> {
    (description: string, callback: (target: Target, services: Services) => any): any;
}
interface InstanceTestFunction<Target, Services> extends BaseInstanceTestFunction<Target, Services> {
    only: BaseInstanceTestFunction<Target, Services>;
    skip: BaseInstanceTestFunction<Target, Services>;
}
export declare function getIt<Target, Services>(getTarget: () => Target, getServices: () => Services): InstanceTestFunction<Target, Services>;
export declare function mountTestCase<T>(getTarget: () => T, prototype: T, methodName: keyof T, callback: () => any, prepare: boolean): void;
export declare function mountStaticTests<Target>(staticTests: StaticTests<Target>, cls: ClassOf<Target>, title: string, prepare: boolean): void;
export interface MethodTestSuite<Target, Services> {
    readonly flag?: TestCaseConf;
    tests(it: InstanceTestFunction<Target, Services | undefined>): void;
}
export interface StaticMethodTestCase<Target> {
    readonly flag?: TestCaseConf;
    tests(it: TestFunction): void;
}
export interface TestSuites<Target, Services> {
    instance?: {
        methods?: InstanceTests<Target, Services>;
        privateMethods?: GeneralInstanceTests<Target, Services>;
        general?: GeneralInstanceTests<Target, Services>;
    };
    static?: {
        methods?: StaticTests<Target>;
        privateMethods?: GeneralStaticTests<Target>;
        general?: GeneralStaticTests<Target>;
    };
}
/**
 * A describer to create a Test Suite for a single class.
 * Using this describer is way to enforce a strict organization in the unit test,
 * where 3 sections are enforced to be written separetely, defnined by the paremeters this method receives
 * @param cls the class you want to test
 * @param bootStrapper method used to create the target instance for the test and the mocked services.
 * It's recommended for all mocked services to be just empty objects but with the correct type.
 * This way, you can stub the methods each method test suite will need and so you can garantee that will
 * be any other code being ran during your test that is not you intented to.
 * @param testSuites test suites is wrapper object for 6 kind of test cases:
 * first, suites are separated by instance and static. The difference between those is that the bootstrapper
 * are not ran for the static tests, as they're intended to static methods.
 * after that, you have three categories on each one: methods, privateMethods and general.
 * For general, there's no trick, it just a usual test. For the other ones, you must specify the name
 * of an existing method. During the test, the only method that will be real is the specified one. Any other method of the class
 * will throw an error. This behavior helps to eliminate scope invasion during the tests, and you're assured that no other code
 * other than the method being tested will run.
 */
export declare function describeClass<Target, Services>(cls: ClassOf<Target>, bootStrapper: () => BootStrapperReturn<Target, Services>, testSuites: TestSuites<Target, Services>): void;
export declare namespace describeClass {
    function only<Target, Services>(cls: ClassOf<Target>, bootStrapper: () => BootStrapperReturn<Target, Services>, testSuites: TestSuites<Target, Services>): void;
    function skip<Target, Services>(cls: ClassOf<Target>, bootStrapper: () => BootStrapperReturn<Target, Services>, testSuites: TestSuites<Target, Services>): void;
}
export {};
