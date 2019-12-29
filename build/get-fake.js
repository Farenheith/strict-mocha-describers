"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strict_describers_1 = require("./strict-describers");
const mocha_1 = require("mocha");
function getFakeInstance(cls) {
    const result = {};
    for (const key of Object.getOwnPropertyNames(cls.prototype)) {
        if (strict_describers_1.testUtils.isMockable(key, cls.prototype, result)) {
            result[key] = strict_describers_1.testUtils.getMockedMethod(key);
        }
    }
    return result;
}
exports.getFakeInstance = getFakeInstance;
let cleanups;
mocha_1.beforeEach(() => {
    cleanups = [];
});
mocha_1.afterEach(() => {
    if (cleanups) {
        cleanups.forEach(x => x());
        cleanups = undefined;
    }
});
function fakeStaticClass(cls) {
    if (cleanups === undefined) {
        throw new Error('Invalid context. Call it inside a beforeEach ou it');
    }
    const backup = strict_describers_1.testUtils.prepare(cls, cls);
    cleanups.push(() => strict_describers_1.testUtils.restoreBackup(backup, cls));
}
exports.fakeStaticClass = fakeStaticClass;
//# sourceMappingURL=get-fake.js.map