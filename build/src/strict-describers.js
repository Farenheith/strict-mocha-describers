"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
function prepare(service, prototype, methodToTest) {
    const methods = [];
    const backup = [];
    for (const key of Object.getOwnPropertyNames(prototype)) {
        if (key !== methodToTest
            && key !== 'constructor'
            && typeof prototype[key] === 'function') {
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
}
exports.prepare = prepare;
function mountTest(service, prototype, methodName, callback) {
    let backup;
    let target;
    mocha_1.beforeEach(() => {
        target = service();
        backup = prepare(target, prototype, methodName);
    });
    callback();
    mocha_1.afterEach(() => {
        for (const pair of backup) {
            target[pair[0]] = pair[1];
        }
    });
}
function describeMethod(service, cls, methodName, callback) {
    mocha_1.describe(`Method ${methodName}`, () => mountTest(service, cls.prototype, methodName, callback));
}
function describeMethodOnly(service, cls, methodName, callback) {
    mocha_1.describe.only(`Method ${methodName}`, () => mountTest(service, cls.prototype, methodName, callback));
}
function describeMethodSkip(service, cls, methodName, callback) {
    mocha_1.describe.skip(`Method ${methodName}`, () => mountTest(service, cls.prototype, methodName, callback));
}
function describeStaticMethod(cls, methodName, callback) {
    mocha_1.describe(`Static method ${methodName}`, () => mountTest(() => cls, cls, methodName, callback));
}
function describeStaticMethodOnly(cls, methodName, callback) {
    mocha_1.describe.only(`Static method ${methodName}`, () => mountTest(() => cls, cls, methodName, callback));
}
function describeStaticMethodSkip(cls, methodName, callback) {
    mocha_1.describe.skip(`Static method ${methodName}`, () => mountTest(() => cls, cls, methodName, callback));
}
exports.method = describeMethod;
exports.method.only = describeMethodOnly;
exports.method.skip = describeMethodSkip;
exports.method.static = describeStaticMethod;
exports.method.static.only = describeStaticMethodOnly;
exports.method.static.skip = describeStaticMethodSkip;
//# sourceMappingURL=strict-describers.js.map