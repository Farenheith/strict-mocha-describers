"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha = require("mocha");
exports.testUtils = {
    prepare(service, prototype, methodToTest) {
        const methods = [];
        const backup = [];
        for (const key of Object.getOwnPropertyNames(prototype)) {
            if (key !== methodToTest
                && typeof prototype[key] === 'function'
                // for instance methods
                && ((service !== prototype
                    && key !== 'constructor'
                // for static classes
                ) || (service === prototype
                    && key !== 'apply'
                    && key !== 'bind'
                    && key !== 'call'
                    && key !== 'toString'))) {
                methods.push(key);
            }
        }
        methods.forEach((m) => {
            backup.push([m, service[m]]);
            service[m] = () => {
                throw new Error('Not mocked yet');
            };
        });
        return backup;
    },
    mountTest(service, prototype, methodName, callback) {
        let backup;
        let target;
        mocha.beforeEach(() => {
            target = service();
            backup = exports.testUtils.prepare(target, prototype, methodName);
        });
        callback();
        mocha.afterEach(() => {
            for (const pair of backup) {
                target[pair[0]] = pair[1];
            }
        });
    },
};
function describeMethod(service, cls, methodName, callback) {
    mocha.describe(`Method ${methodName}`, () => exports.testUtils.mountTest(service, cls.prototype, methodName, callback));
}
exports.describeMethod = describeMethod;
function describeMethodOnly(service, cls, methodName, callback) {
    mocha.describe.only(`Method ${methodName}`, () => exports.testUtils.mountTest(service, cls.prototype, methodName, callback));
}
exports.describeMethodOnly = describeMethodOnly;
function describeMethodSkip(service, cls, methodName, callback) {
    mocha.describe.skip(`Method ${methodName}`, () => exports.testUtils.mountTest(service, cls.prototype, methodName, callback));
}
exports.describeMethodSkip = describeMethodSkip;
function describeStaticMethod(cls, methodName, callback) {
    mocha.describe(`Static method ${methodName}`, () => exports.testUtils.mountTest(() => cls, cls, methodName, callback));
}
exports.describeStaticMethod = describeStaticMethod;
function describeStaticMethodOnly(cls, methodName, callback) {
    mocha.describe.only(`Static method ${methodName}`, () => exports.testUtils.mountTest(() => cls, cls, methodName, callback));
}
exports.describeStaticMethodOnly = describeStaticMethodOnly;
function describeStaticMethodSkip(cls, methodName, callback) {
    mocha.describe.skip(`Static method ${methodName}`, () => exports.testUtils.mountTest(() => cls, cls, methodName, callback));
}
exports.describeStaticMethodSkip = describeStaticMethodSkip;
exports.method = describeMethod;
exports.method.only = describeMethodOnly;
exports.method.skip = describeMethodSkip;
exports.method.static = describeStaticMethod;
exports.method.static.only = describeStaticMethodOnly;
exports.method.static.skip = describeStaticMethodSkip;
//# sourceMappingURL=strict-describers.js.map