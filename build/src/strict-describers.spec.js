"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const mocha = require("mocha");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const strictDescribers = require("./strict-describers");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const expect_call_1 = require("./expect-call");
chai.use(sinonChai);
class Test {
    constructor() {
        this.property1 = 'teste';
    }
    method1() {
        return 'result1';
    }
    method2() {
        return 'result2';
    }
    method3() {
        return 'result3';
    }
    static staticMethod1() {
        return 'static result1';
    }
    static staticMethod2() {
        return 'static result2';
    }
    static staticMethod3() {
        return 'static result3';
    }
}
mocha_1.describe('strict-describers', () => {
    mocha_1.afterEach(() => {
        sinon.restore();
    });
    mocha_1.describe('method', () => {
        mocha_1.it('should map describers functions correctly', () => {
            chai_1.expect(strictDescribers.method.only).eq(strictDescribers.describeMethodOnly);
            chai_1.expect(strictDescribers.method.skip).eq(strictDescribers.describeMethodSkip);
            chai_1.expect(strictDescribers.method.static).eq(strictDescribers.describeStaticMethod);
            chai_1.expect(strictDescribers.method.static.only).eq(strictDescribers.describeStaticMethodOnly);
            chai_1.expect(strictDescribers.method.static.skip).eq(strictDescribers.describeStaticMethodSkip);
        });
    });
    mocha_1.describe('testUtils', () => {
        mocha_1.describe('prepare', () => {
            mocha_1.it('should remove all instance methods except method2', () => {
                const obj = new Test();
                let error;
                strictDescribers.testUtils.prepare(obj, Test.prototype, 'method2');
                try {
                    obj.method1();
                }
                catch (err) {
                    error = err;
                }
                chai_1.expect(error.message).to.be.eq('Not mocked yet');
                error = undefined;
                try {
                    obj.method3();
                }
                catch (err) {
                    error = err;
                }
                chai_1.expect(error.message).to.be.eq('Not mocked yet');
                chai_1.expect(obj.method2()).to.be.eq('result2');
            });
            mocha_1.it('should replace behavior of instance method', () => {
                const obj = new Test();
                let error;
                strictDescribers.testUtils.prepare(obj, Test.prototype, 'method2');
                sinon.stub(obj, 'method1').returns('mocked');
                chai_1.expect(obj.method1()).to.be.eq('mocked');
                try {
                    obj.method3();
                }
                catch (err) {
                    error = err;
                }
                chai_1.expect(error.message).to.be.eq('Not mocked yet');
                chai_1.expect(obj.method2()).to.be.eq('result2');
            });
            mocha_1.it('should remove all static methods except method2', () => {
                let error;
                strictDescribers.testUtils.prepare(Test, Test, 'staticMethod2');
                try {
                    Test.staticMethod1();
                }
                catch (err) {
                    error = err;
                }
                chai_1.expect(error.message).to.be.eq('Not mocked yet');
                error = undefined;
                try {
                    Test.staticMethod3();
                }
                catch (err) {
                    error = err;
                }
                chai_1.expect(error.message).to.be.eq('Not mocked yet');
                chai_1.expect(Test.staticMethod2()).to.be.eq('static result2');
            });
            mocha_1.it('should replace behavior of static method', () => {
                let error;
                strictDescribers.testUtils.prepare(Test, Test, 'staticMethod2');
                sinon.stub(Test, 'staticMethod1').returns('mocked');
                chai_1.expect(Test.staticMethod1()).to.be.eq('mocked');
                try {
                    Test.staticMethod3();
                }
                catch (err) {
                    error = err;
                }
                chai_1.expect(error.message).to.be.eq('Not mocked yet');
                chai_1.expect(Test.staticMethod2()).to.be.eq('static result2');
            });
        });
        mocha_1.describe('mountTest', () => {
            const test = new Test();
            let callback;
            let service;
            mocha_1.beforeEach(() => {
                service = sinon.stub().returns(test);
                sinon.stub(mocha, 'beforeEach').callsFake(x => x());
                callback = sinon.stub();
                sinon.stub(strictDescribers.testUtils, 'prepare').returns([
                    ['test1', 'value1'],
                    ['test2', 'value2'],
                ]);
                sinon.stub(mocha, 'afterEach').callsFake(x => x());
            });
            mocha_1.it('should mount a test describer correctly', () => {
                const result = strictDescribers.testUtils.mountTest(service, Test.prototype, 'method1', callback);
                expect_call_1.expectCall(mocha.beforeEach, [sinon.match.func]);
                expect_call_1.expectCall(service, []);
                expect_call_1.expectCall(strictDescribers.testUtils.prepare, [test, Test.prototype, 'method1']);
                expect_call_1.expectCall(callback, []);
                expect_call_1.expectCall(mocha.afterEach, [sinon.match.func]);
                chai_1.expect(result).eq(undefined);
                chai_1.expect(test.test1).eq('value1');
                chai_1.expect(test.test2).eq('value2');
            });
        });
    });
    mocha_1.describe('instance describers', () => {
        mocha_1.describe('describeMethod', () => {
            const bkp = mocha.describe;
            let callback;
            let actualService;
            mocha_1.beforeEach(() => {
                callback = sinon.stub();
                sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake((service, _cls, _method, cb) => {
                    actualService = service();
                    cb();
                });
                mocha.describe = sinon.stub().callsFake((_a, func) => func());
            });
            mocha_1.afterEach(() => {
                mocha.describe.only = bkp;
            });
            mocha_1.it('should call describe', () => {
                const test = new Test();
                const createInstance = () => test;
                const result = strictDescribers.describeMethod(createInstance, Test, 'method1', callback);
                expect_call_1.expectCall(mocha.describe, [`Method method1`, sinon.match.func]);
                expect_call_1.expectCall(strictDescribers.testUtils.mountTest, [createInstance, Test.prototype, 'method1', sinon.match.func]);
                expect_call_1.expectCall(callback, []);
                chai_1.expect(actualService).to.be.eq(test);
                chai_1.expect(result).to.be.eq(undefined);
            });
        });
        mocha_1.describe('describeMethodOnly', () => {
            const bkp = mocha.describe.only;
            let callback;
            let actualService;
            mocha_1.beforeEach(() => {
                callback = sinon.stub();
                sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake((service, _cls, _method, cb) => {
                    actualService = service();
                    cb();
                });
                mocha.describe.only = sinon.stub().callsFake((_a, func) => func());
            });
            mocha_1.afterEach(() => {
                mocha.describe.only = bkp;
            });
            mocha_1.it('should call describe', () => {
                const test = new Test();
                const createInstance = () => test;
                const result = strictDescribers.describeMethodOnly(createInstance, Test, 'method1', callback);
                expect_call_1.expectCall(mocha.describe.only, [`Method method1`, sinon.match.func]);
                expect_call_1.expectCall(strictDescribers.testUtils.mountTest, [createInstance, Test.prototype, 'method1', sinon.match.func]);
                expect_call_1.expectCall(callback, []);
                chai_1.expect(actualService).to.be.eq(test);
                chai_1.expect(result).to.be.eq(undefined);
            });
        });
        mocha_1.describe('describeMethodSkip', () => {
            const bkp = mocha.describe.skip;
            let callback;
            let actualService;
            mocha_1.beforeEach(() => {
                callback = sinon.stub();
                sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake((service, _cls, _method, cb) => {
                    actualService = service();
                    cb();
                });
                mocha.describe.skip = sinon.stub().callsFake((_a, func) => func());
            });
            mocha_1.afterEach(() => {
                mocha.describe.skip = bkp;
            });
            mocha_1.it('should call describe', () => {
                const test = new Test();
                const createInstance = () => test;
                const result = strictDescribers.describeMethodSkip(createInstance, Test, 'method1', callback);
                expect_call_1.expectCall(mocha.describe.skip, [`Method method1`, sinon.match.func]);
                expect_call_1.expectCall(strictDescribers.testUtils.mountTest, [createInstance, Test.prototype, 'method1', sinon.match.func]);
                expect_call_1.expectCall(callback, []);
                chai_1.expect(actualService).to.be.eq(test);
                chai_1.expect(result).to.be.eq(undefined);
            });
        });
    });
    mocha_1.describe('static describers', () => {
        mocha_1.describe('describeStaticMethod', () => {
            const bkp = mocha.describe;
            let callback;
            let actualService;
            mocha_1.beforeEach(() => {
                callback = sinon.stub();
                sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake((service, _cls, _method, cb) => {
                    actualService = service();
                    cb();
                });
                mocha.describe = sinon.stub().callsFake((_a, func) => func());
            });
            mocha_1.afterEach(() => {
                mocha.describe = bkp;
            });
            mocha_1.it('should call describe', () => {
                const result = strictDescribers.describeStaticMethod(Test, 'staticMethod1', callback);
                expect_call_1.expectCall(mocha.describe, [`Static method staticMethod1`, sinon.match.func]);
                expect_call_1.expectCall(strictDescribers.testUtils.mountTest, [sinon.match.func, Test, 'staticMethod1', callback]);
                expect_call_1.expectCall(callback, []);
                chai_1.expect(actualService).to.be.eq(Test);
                chai_1.expect(result).to.be.eq(undefined);
            });
        });
        mocha_1.describe('describeStaticMethodOnly', () => {
            const bkp = mocha.describe.only;
            let callback;
            let actualService;
            mocha_1.beforeEach(() => {
                callback = sinon.stub();
                sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake((service, _cls, _method, cb) => {
                    actualService = service();
                    cb();
                });
                mocha.describe.only = sinon.stub().callsFake((_a, func) => func());
            });
            mocha_1.afterEach(() => {
                mocha.describe.only = bkp;
            });
            mocha_1.it('should call describe', () => {
                const result = strictDescribers.describeStaticMethodOnly(Test, 'staticMethod1', callback);
                expect_call_1.expectCall(mocha.describe.only, [`Static method staticMethod1`, sinon.match.func]);
                expect_call_1.expectCall(strictDescribers.testUtils.mountTest, [sinon.match.func, Test, 'staticMethod1', callback]);
                expect_call_1.expectCall(callback, []);
                chai_1.expect(actualService).to.be.eq(Test);
                chai_1.expect(result).to.be.eq(undefined);
            });
        });
        mocha_1.describe('describeStaticMethodSkip', () => {
            const bkp = mocha.describe.skip;
            let callback;
            let actualService;
            mocha_1.beforeEach(() => {
                callback = sinon.stub();
                sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake((service, _cls, _method, cb) => {
                    actualService = service();
                    cb();
                });
                mocha.describe.skip = sinon.stub().callsFake((_a, func) => func());
            });
            mocha_1.afterEach(() => {
                mocha.describe.skip = bkp;
            });
            mocha_1.it('should call describe', () => {
                const result = strictDescribers.describeStaticMethodSkip(Test, 'staticMethod1', callback);
                expect_call_1.expectCall(mocha.describe.skip, [`Static method staticMethod1`, sinon.match.func]);
                expect_call_1.expectCall(strictDescribers.testUtils.mountTest, [sinon.match.func, Test, 'staticMethod1', callback]);
                expect_call_1.expectCall(callback, []);
                chai_1.expect(actualService).to.be.eq(Test);
                chai_1.expect(result).to.be.eq(undefined);
            });
        });
    });
});
//# sourceMappingURL=strict-describers.spec.js.map