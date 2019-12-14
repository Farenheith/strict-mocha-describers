"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strict_describers_1 = require("./strict-describers");
const strict_it_1 = require("./strict-it");
class MethodDescribeHelper {
    constructor(bootstrap, cls) {
        this.bootstrap = bootstrap;
        this.cls = cls;
    }
    createMethodDescribe(suite) {
        return (method, fn) => {
            const wrapper = {};
            const itHelper = new strict_it_1.ItHelper(wrapper);
            const it = itHelper.createIt();
            let backup;
            suite(`method ${method}`, () => {
                beforeEach(() => {
                    wrapper.target = this.bootstrap();
                    backup = strict_describers_1.testUtils.prepare(wrapper.target, this.cls.prototype, method);
                });
                fn(it);
                afterEach(() => {
                    for (const pair of backup) {
                        wrapper.target[pair[0]] = pair[1];
                    }
                });
            });
        };
    }
    createStaticDescribe(suite) {
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
    createDescribe() {
        const result = this.createMethodDescribe(describe);
        result.skip = this.createMethodDescribe(describe.skip);
        result.only = this.createMethodDescribe(describe.only);
        result.static = this.createStaticDescribe(describe);
        result.static.skip = this.createStaticDescribe(describe.skip);
        result.static.only = this.createStaticDescribe(describe.only);
        return result;
    }
}
exports.MethodDescribeHelper = MethodDescribeHelper;
//# sourceMappingURL=strict-describe-method.js.map