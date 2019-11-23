"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const strict_describers_1 = require("./strict-describers");
function mountTests(cls, staticTests, bootStrapper, instanceTests) {
    if (staticTests) {
        mountStaticTests(staticTests, cls);
    }
    mountInstanceTests(bootStrapper, instanceTests, cls);
}
exports.mountTests = mountTests;
function mountInstanceTests(bootStrapper, instanceTests, cls) {
    mocha_1.describe('instance methods', () => {
        let bootStrap;
        mocha_1.beforeEach(() => bootStrap = bootStrapper());
        mocha_1.describe('', () => {
            for (const method of Object.getOwnPropertyNames(instanceTests)) {
                const testCase = instanceTests[method];
                const callback = () => strict_describers_1.testUtils.mountTest(() => bootStrap.target, cls.prototype, method, () => testCase.tests(bootStrap.target, bootStrap.services));
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
    });
}
exports.mountInstanceTests = mountInstanceTests;
function mountTestCase(target, prototype, methodName, callback) {
    let backup;
    mocha_1.beforeEach(() => {
        backup = strict_describers_1.testUtils.prepare(target, prototype, methodName);
    });
    callback();
    afterEach(() => {
        for (const pair of backup) {
            target[pair[0]] = pair[1];
        }
    });
}
exports.mountTestCase = mountTestCase;
function mountStaticTests(staticTests, cls) {
    mocha_1.describe('static methods', () => {
        for (const method of Object.getOwnPropertyNames(staticTests)) {
            const testCase = staticTests[method];
            const callback = () => mountTestCase(cls, cls, method, () => testCase.tests(cls));
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
function describeClass(cls, bootStrapper, instanceTests, staticTests) {
    mocha_1.describe(`Class ${cls.name}`, () => {
        mountTests(cls, staticTests, bootStrapper, instanceTests);
    });
}
exports.describeClass = describeClass;
(function (describeClass) {
    function only(cls, bootStrapper, instanceTests, staticTests) {
        mocha_1.describe.only(`Class ${cls.name}`, () => {
            mountTests(cls, staticTests, bootStrapper, instanceTests);
        });
    }
    describeClass.only = only;
    function skip(cls, bootStrapper, instanceTests, staticTests) {
        mocha_1.describe.skip(`Class ${cls.name}`, () => {
            mountTests(cls, staticTests, bootStrapper, instanceTests);
        });
    }
    describeClass.skip = skip;
})(describeClass = exports.describeClass || (exports.describeClass = {}));
//# sourceMappingURL=describe-class.js.map