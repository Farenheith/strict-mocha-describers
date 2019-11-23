"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const strict_describers_1 = require("./strict-describers");
function mountTests(cls, bootStrapper, testSuites) {
    if (testSuites.static) {
        if (testSuites.static.methods) {
            mountStaticTests(testSuites.static.methods, cls, 'Static methods', false);
        }
        if (testSuites.static.privateMethods) {
            mountStaticTests(testSuites.static.privateMethods, cls, 'Private static methods', true);
        }
        if (testSuites.static.general) {
            mountStaticTests(testSuites.static.general, cls, 'General static tests', false);
        }
    }
    if (testSuites.instance) {
        if (testSuites.instance.methods) {
            mountInstanceTests(bootStrapper, testSuites.instance.methods, cls, 'Instance methods', true);
        }
        if (testSuites.instance.privateMethods) {
            mountInstanceTests(bootStrapper, testSuites.instance.privateMethods, cls, 'Instance methods', true);
        }
        if (testSuites.instance.general) {
            mountInstanceTests(bootStrapper, testSuites.instance.general, cls, 'General instance tests', false);
        }
    }
}
exports.mountTests = mountTests;
function mountInstanceTests(bootStrapper, instanceTests, cls, title, prepare) {
    mocha_1.describe(title, () => {
        let bootStrap;
        mocha_1.beforeEach(() => bootStrap = bootStrapper());
        for (const method of Object.getOwnPropertyNames(instanceTests)) {
            const testCase = instanceTests[method];
            const it = getIt(() => bootStrap.target, () => bootStrap.services);
            const callback = () => mountTestCase(() => bootStrap.target, cls.prototype, method, () => testCase.tests(it), prepare);
            switch (testCase.flag) {
                case 'only':
                    mocha_1.describe.only(`.${method}()`, callback);
                    break;
                case 'skip':
                    mocha_1.describe.skip(`.${method}()`, callback);
                    break;
                default:
                    mocha_1.describe(`.${method}()`, callback);
            }
        }
    });
}
exports.mountInstanceTests = mountInstanceTests;
function getIt(getTarget, getServices) {
    const result = ((description, callback) => {
        return mocha_1.it(description, () => callback(getTarget(), getServices()));
    });
    result.only = ((description, callback) => {
        return mocha_1.it.only(description, () => callback(getTarget(), getServices()));
    });
    result.skip = ((description, callback) => {
        return mocha_1.it.skip(description, () => callback(getTarget(), getServices()));
    });
    return result;
}
exports.getIt = getIt;
function mountTestCase(getTarget, prototype, methodName, callback, prepare) {
    let backup;
    let target;
    mocha_1.beforeEach(() => {
        target = getTarget();
        if (prepare) {
            backup = strict_describers_1.testUtils.prepare(target, prototype, methodName);
        }
    });
    callback();
    if (prepare) {
        afterEach(() => {
            for (const pair of backup) {
                target[pair[0]] = pair[1];
            }
        });
    }
}
exports.mountTestCase = mountTestCase;
function mountStaticTests(staticTests, cls, title, prepare) {
    mocha_1.describe(title, () => {
        for (const method of Object.getOwnPropertyNames(staticTests)) {
            const testCase = staticTests[method];
            const callback = () => mountTestCase(() => cls, cls, method, () => testCase.tests(mocha_1.it), prepare);
            switch (testCase.flag) {
                case 'only':
                    mocha_1.describe.only(`.${method}()`, callback);
                    break;
                case 'skip':
                    mocha_1.describe.skip(`.${method}()`, callback);
                    break;
                default:
                    mocha_1.describe(`.${method}()`, callback);
            }
        }
    });
}
exports.mountStaticTests = mountStaticTests;
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
function describeClass(cls, bootStrapper, testSuites) {
    mocha_1.describe(`Class ${cls.name}`, () => {
        mountTests(cls, bootStrapper, testSuites);
    });
}
exports.describeClass = describeClass;
(function (describeClass) {
    function only(cls, bootStrapper, testSuites) {
        mocha_1.describe.only(`Class ${cls.name}`, () => {
            mountTests(cls, bootStrapper, testSuites);
        });
    }
    describeClass.only = only;
    function skip(cls, bootStrapper, testSuites) {
        mocha_1.describe.skip(`Class ${cls.name}`, () => {
            mountTests(cls, bootStrapper, testSuites);
        });
    }
    describeClass.skip = skip;
})(describeClass = exports.describeClass || (exports.describeClass = {}));
//# sourceMappingURL=describe-class.js.map