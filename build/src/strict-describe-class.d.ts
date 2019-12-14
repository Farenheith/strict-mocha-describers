import { ClassOf } from './strict-describers';
import { MethodSuite, StaticMethodSuite } from './strict-describe-method';
export declare function mountClassDescribe<Target>(cls: ClassOf<Target>, bootStrap: () => Target, fn: (describe: MethodSuite<Target>) => void, suite: (description: string, fn: () => void) => void): void;
export declare function mountStaticClassDescribe<Target>(cls: ClassOf<Target>, fn: (describe: StaticMethodSuite<Target>) => void, suite: (description: string, fn: () => void) => void): void;
/**
 * A describer to create a Test Suite for a single class.
 * Using this describer is way to enforce a strict organization in the unit test,
 * where 3 sections are enforced to be written separetely, defnined by the paremeters this method receives
 * @param cls the class you want to test
 * @param bootStrapper method used to create the target instance for the test and the mocked services.
 * It's recommended for all mocked services to be just empty objects but with the correct type.
 * This way, you can stub each method each 'method test suite' will need and so you can garantee that
 * no other class will run during your test that you didn't intented to.
 * @param testSuites test suites is a wrapper object for 6 kind of test cases:
 * first, suites are separated by 'instance' and 'static'. The difference between those is that the bootstrapper
 * are not ran for the static tests, as they're intended to static methods.
 * after that, you have three categories on each one: methods, privateMethods and general.
 * For general, there's no trick, it just an usual test. For the other ones, you must specify the name
 * of an existing method. During the test, the only method that will be real is the specified one. Any other method of the class
 * will throw an error. This behavior helps to eliminate scope invasion during the tests, and you're assured that no other code
 * other than the method being tested will run.
 */
export declare function describeClass<Target>(cls: ClassOf<Target>, bootStrapper: () => Target, fn: (describe: MethodSuite<Target>) => void): void;
export declare namespace describeClass {
    function only<Target>(cls: ClassOf<Target>, bootStrapper: () => Target, fn: (describe: MethodSuite<Target>) => void): void;
    function skip<Target>(cls: ClassOf<Target>, bootStrapper: () => Target, fn: (describe: MethodSuite<Target>) => void): void;
}
export declare function describeStaticClass<Target>(cls: ClassOf<Target>, fn: (describe: StaticMethodSuite<Target>) => void): void;
export declare namespace describeStaticClass {
    function only<Target>(cls: ClassOf<Target>, fn: (describe: StaticMethodSuite<Target>) => void): void;
    function skip<Target>(cls: ClassOf<Target>, fn: (describe: StaticMethodSuite<Target>) => void): void;
}
