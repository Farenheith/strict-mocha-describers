"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const strict_describe_method_1 = require("./strict-describe-method");
function mountClassDescribe(cls, bootStrap, fn, suite) {
    const methodDescribeHelper = new strict_describe_method_1.MethodDescribeHelper(bootStrap, cls);
    suite(`class ${cls.name}`, () => {
        fn(methodDescribeHelper.createDescribe());
    });
}
exports.mountClassDescribe = mountClassDescribe;
function mountSructDescribe(cls, description, fn, suite) {
    const methodDescribeHelper = new strict_describe_method_1.StaticMethodDescribeHelper(cls);
    suite(description, () => {
        fn(methodDescribeHelper.createStaticDescribe());
    });
}
exports.mountSructDescribe = mountSructDescribe;
function mountStaticClassDescribe(cls, fn, suite) {
    const methodDescribeHelper = new strict_describe_method_1.StaticMethodDescribeHelper(cls);
    suite(`static class ${cls.name}`, () => {
        fn(methodDescribeHelper.createStaticDescribe());
    });
}
exports.mountStaticClassDescribe = mountStaticClassDescribe;
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
function describeClass(cls, bootStrapper, fn) {
    mountClassDescribe(cls, bootStrapper, fn, mocha_1.describe);
}
exports.describeClass = describeClass;
// tslint:disable-next-line: no-namespace
(function (describeClass) {
    function only(cls, bootStrapper, fn) {
        mountClassDescribe(cls, bootStrapper, fn, mocha_1.describe.only);
    }
    describeClass.only = only;
    function skip(cls, bootStrapper, fn) {
        mountClassDescribe(cls, bootStrapper, fn, mocha_1.describe.skip);
    }
    describeClass.skip = skip;
})(describeClass = exports.describeClass || (exports.describeClass = {}));
function describeStaticClass(cls, fn) {
    mountStaticClassDescribe(cls, fn, mocha_1.describe);
}
exports.describeStaticClass = describeStaticClass;
// tslint:disable-next-line: no-namespace
(function (describeStaticClass) {
    function only(cls, fn) {
        mountStaticClassDescribe(cls, fn, mocha_1.describe.only);
    }
    describeStaticClass.only = only;
    function skip(cls, fn) {
        mountStaticClassDescribe(cls, fn, mocha_1.describe.skip);
    }
    describeStaticClass.skip = skip;
})(describeStaticClass = exports.describeStaticClass || (exports.describeStaticClass = {}));
function describeSruct(struct, description, fn) {
    mountSructDescribe(struct, description, fn, mocha_1.describe);
}
exports.describeSruct = describeSruct;
// tslint:disable-next-line: no-namespace
(function (describeSruct) {
    function only(struct, description, fn) {
        mountSructDescribe(struct, description, fn, mocha_1.describe.only);
    }
    describeSruct.only = only;
    function skip(struct, description, fn) {
        mountSructDescribe(struct, description, fn, mocha_1.describe.skip);
    }
    describeSruct.skip = skip;
})(describeSruct = exports.describeSruct || (exports.describeSruct = {}));
//# sourceMappingURL=strict-describe-class.js.map