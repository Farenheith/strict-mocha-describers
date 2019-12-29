"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strict_describers_1 = require("./strict-describers");
const strict_it_1 = require("./strict-it");
class StaticMethodDescribeHelper {
    constructor(cls) {
        this.cls = cls;
    }
    createSingleStaticDescribe(suite) {
        return (method, fn) => {
            suite(`static method ${method}`, () => {
                let backup;
                beforeEach(() => {
                    backup = strict_describers_1.testUtils.prepare(this.cls, this.cls, method);
                });
                fn(it);
                afterEach(() => {
                    for (const pair of backup) {
                        this.cls[pair[0]] = pair[1];
                    }
                });
            });
        };
    }
    createStaticDescribe() {
        const result = this.createSingleStaticDescribe(describe);
        result.skip = this.createSingleStaticDescribe(describe.skip);
        result.only = this.createSingleStaticDescribe(describe.only);
        return result;
    }
}
exports.StaticMethodDescribeHelper = StaticMethodDescribeHelper;
class MethodDescribeHelper extends StaticMethodDescribeHelper {
    constructor(bootstrap, cls) {
        super(cls);
        this.bootstrap = bootstrap;
    }
    createMethodDescribe(suite) {
        return (method, fn) => {
            const wrapper = {};
            const itHelper = new strict_it_1.ItHelper(wrapper);
            const it = itHelper.createIt();
            let backup;
            let staticBackup;
            suite(`method ${method}`, () => {
                beforeEach(() => {
                    wrapper.target = this.bootstrap();
                    backup = strict_describers_1.testUtils.prepare(wrapper.target, this.cls.prototype, method);
                    staticBackup = strict_describers_1.testUtils.prepare(this.cls, this.cls);
                });
                fn(it, () => wrapper.target);
                afterEach(() => {
                    for (const pair of backup) {
                        wrapper.target[pair[0]] = pair[1];
                    }
                    for (const pair of staticBackup) {
                        this.cls[pair[0]] = pair[1];
                    }
                });
            });
        };
    }
    createDescribe() {
        const result = this.createMethodDescribe(describe);
        result.skip = this.createMethodDescribe(describe.skip);
        result.only = this.createMethodDescribe(describe.only);
        result.static = this.createStaticDescribe();
        return result;
    }
}
exports.MethodDescribeHelper = MethodDescribeHelper;
//# sourceMappingURL=strict-describe-method.js.map