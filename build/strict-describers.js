"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha = require("mocha");
exports.testUtils = {
    prepare(service, prototype, methodToTest) {
        const methods = [];
        const backup = [];
        for (const key of Object.getOwnPropertyNames(prototype)) {
            if (exports.testUtils.isMockable(key, prototype, service, methodToTest)) {
                methods.push(key);
            }
        }
        methods.forEach((m) => {
            backup.push([m, service[m]]);
            service[m] = exports.testUtils.getMockedMethod(m);
        });
        return backup;
    },
    mountStaticTest(cls, methodName, callback) {
        let backup;
        let target;
        mocha.beforeEach(() => {
            target = cls;
            backup = exports.testUtils.prepare(target, cls, methodName);
        });
        callback();
        mocha.afterEach(() => {
            exports.testUtils.restoreBackup(backup, target);
        });
    },
    mountInstanceTest(service, cls, methodName, callback) {
        let backup;
        let staticBackup;
        let target;
        mocha.beforeEach(() => {
            target = service();
            backup = exports.testUtils.prepare(target, cls.prototype, methodName);
            staticBackup = exports.testUtils.prepare(cls, cls);
        });
        callback();
        mocha.afterEach(() => {
            exports.testUtils.restoreBackup(backup, target);
            exports.testUtils.restoreBackup(staticBackup, cls);
        });
    },
    restoreBackup(backup, target) {
        for (const pair of backup) {
            target[pair[0]] = pair[1];
        }
    },
    isMockable(key, prototype, service, methodToTest) {
        return key !== methodToTest
            && typeof prototype[key] === 'function'
            // for instance methods
            && ((service !== prototype
                && key !== 'constructor'
            // for static classes
            ) || (service === prototype
                && key !== 'apply'
                && key !== 'bind'
                && key !== 'call'
                && key !== 'toString'));
    },
    getMockedMethod(name) {
        const result = eval(`(function ${name} () { throw new Error('${name} not mocked yet'); })`);
        return result;
    }
};
function describeMethod(service, cls, methodName, callback) {
    mocha.describe(`Method ${methodName}`, () => exports.testUtils.mountInstanceTest(service, cls, methodName, callback));
}
exports.describeMethod = describeMethod;
function describeMethodOnly(service, cls, methodName, callback) {
    mocha.describe.only(`Method ${methodName}`, () => exports.testUtils.mountInstanceTest(service, cls, methodName, callback));
}
exports.describeMethodOnly = describeMethodOnly;
function describeMethodSkip(service, cls, methodName, callback) {
    mocha.describe.skip(`Method ${methodName}`, () => exports.testUtils.mountInstanceTest(service, cls, methodName, callback));
}
exports.describeMethodSkip = describeMethodSkip;
function describeStaticMethod(cls, methodName, callback) {
    mocha.describe(`Static method ${methodName}`, () => exports.testUtils.mountStaticTest(cls, methodName, callback));
}
exports.describeStaticMethod = describeStaticMethod;
function describeStaticMethodOnly(cls, methodName, callback) {
    mocha.describe.only(`Static method ${methodName}`, () => exports.testUtils.mountStaticTest(cls, methodName, callback));
}
exports.describeStaticMethodOnly = describeStaticMethodOnly;
function describeStaticMethodSkip(cls, methodName, callback) {
    mocha.describe.skip(`Static method ${methodName}`, () => exports.testUtils.mountStaticTest(cls, methodName, callback));
}
exports.describeStaticMethodSkip = describeStaticMethodSkip;
exports.method = describeMethod;
exports.method.only = describeMethodOnly;
exports.method.skip = describeMethodSkip;
exports.method.static = describeStaticMethod;
exports.method.static.only = describeStaticMethodOnly;
exports.method.static.skip = describeStaticMethodSkip;
//# sourceMappingURL=strict-describers.js.map