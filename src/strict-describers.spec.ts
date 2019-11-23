import * as chai from 'chai';
import * as mocha from 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as strictDescribers from './strict-describers';

import { afterEach, beforeEach, describe, it } from 'mocha';

import { expect } from 'chai';
import { expectCall } from './expect-call';

chai.use(sinonChai);

class Test {
	property1 = 'teste';

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
  
describe('strict-describers', () => {
	afterEach(() => {
		sinon.restore();
	});

	describe('method', () => {
		it('should map describers functions correctly', () => {
			expect(strictDescribers.method.only).eq(strictDescribers.describeMethodOnly);
			expect(strictDescribers.method.skip).eq(strictDescribers.describeMethodSkip);
			expect(strictDescribers.method.static).eq(strictDescribers.describeStaticMethod);
			expect(strictDescribers.method.static.only).eq(strictDescribers.describeStaticMethodOnly);
			expect(strictDescribers.method.static.skip).eq(strictDescribers.describeStaticMethodSkip);
		})
	});

	describe('testUtils', () => {
		describe('prepare', () => {
			it('should remove all instance methods except method2', () => {
				const obj = new Test();
				let error: Error | undefined;
    
				strictDescribers.testUtils.prepare(obj, Test.prototype, 'method2');
    
				try {
					obj.method1();
				} catch (err) {
					error = err;
				}
				expect(error!.message).to.be.eq('Not mocked yet');
				error = undefined;
				try {
					obj.method3();
				} catch (err) {
					error = err;
				}
				expect(error!.message).to.be.eq('Not mocked yet');
				expect(obj.method2()).to.be.eq('result2');
			});
    
			it('should replace behavior of instance method', () => {
				const obj = new Test();
				let error: Error | undefined;
    
				strictDescribers.testUtils.prepare(obj, Test.prototype, 'method2');
				sinon.stub(obj, 'method1').returns('mocked');
    
				expect(obj.method1()).to.be.eq('mocked');
				try {
					obj.method3();
				} catch (err) {
					error = err;
				}
				expect(error!.message).to.be.eq('Not mocked yet');
				expect(obj.method2()).to.be.eq('result2');
			});

			it('should remove all static methods except method2', () => {
				let error: Error | undefined;
    
				strictDescribers.testUtils.prepare(Test, Test, 'staticMethod2');
    
				try {
					Test.staticMethod1();
				} catch (err) {
					error = err;
				}
				expect(error!.message).to.be.eq('Not mocked yet');
				error = undefined;
				try {
					Test.staticMethod3();
				} catch (err) {
					error = err;
				}
				expect(error!.message).to.be.eq('Not mocked yet');
				expect(Test.staticMethod2()).to.be.eq('static result2');
			});
    
			it('should replace behavior of static method', () => {
				let error: Error | undefined;
    
				strictDescribers.testUtils.prepare(Test, Test, 'staticMethod2');
				sinon.stub(Test, 'staticMethod1').returns('mocked');
    
				expect(Test.staticMethod1()).to.be.eq('mocked');
				try {
					Test.staticMethod3();
				} catch (err) {
					error = err;
				}
				expect(error!.message).to.be.eq('Not mocked yet');
				expect(Test.staticMethod2()).to.be.eq('static result2');
			});
		});
    
		describe('mountTest', () => {
			const test = new Test();
			let callback: sinon.SinonStub;
			let service: sinon.SinonStub;

			beforeEach(() => {
				service = sinon.stub().returns(test);
				sinon.stub(mocha, 'beforeEach').callsFake(x => (x as any)());
				callback = sinon.stub();
				sinon.stub(strictDescribers.testUtils, 'prepare').returns([
				['test1', 'value1' as any],
					['test2', 'value2' as any],
				]);
				sinon.stub(mocha, 'afterEach').callsFake(x => (x as any)());
			});

			it('should mount a test describer correctly', () => {
				const result = strictDescribers.testUtils.mountTest(
					service, Test.prototype, 'method1', callback);

				expectCall(mocha.beforeEach, [sinon.match.func]);
				expectCall(service, []);
				expectCall(strictDescribers.testUtils.prepare,
					[test, Test.prototype, 'method1']);
				expectCall(callback, []);
				expectCall(mocha.afterEach, [sinon.match.func]);
				expect(result).eq(undefined);
				expect((test as any).test1).eq('value1');
				expect((test as any).test2).eq('value2');
			});
		});
	});

	describe('instance describers', () => {
		describe('describeMethod', () => {
			const bkp = mocha.describe;
			let callback: sinon.SinonStub;
			let actualService: any;

			beforeEach(() => {
				callback = sinon.stub();
				sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake(
					(service, _cls, _method, cb) => {
						actualService = service();
						cb();
					},
				);
				(mocha as any).describe = sinon.stub().callsFake((_a, func) => func());
			});

			afterEach(() => {
				mocha.describe.only = bkp;
			});

			it('should call describe', () => {
				const test = new Test();
				const createInstance = () => test;

				const result = strictDescribers.describeMethod(createInstance, Test,
					'method1', callback);

				expectCall(mocha.describe,
					[`Method method1`, sinon.match.func]);
				expectCall(strictDescribers.testUtils.mountTest,
					[createInstance, Test.prototype, 'method1', sinon.match.func]);
				expectCall(callback, []);
				expect(actualService).to.be.eq(test);
				expect(result).to.be.eq(undefined);
			});
		});

		describe('describeMethodOnly', () => {
			const bkp = mocha.describe.only;
			let callback: sinon.SinonStub;
			let actualService: any;

			beforeEach(() => {
				callback = sinon.stub();
				sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake(
					(service, _cls, _method, cb) => {
						actualService = service();
						cb();
					},
				);
				mocha.describe.only = sinon.stub().callsFake((_a, func) => func());
			});

			afterEach(() => {
				mocha.describe.only = bkp;
			});

			it('should call describe', () => {
				const test = new Test();
				const createInstance = () => test;

				const result = strictDescribers.describeMethodOnly(createInstance, Test,
					'method1', callback);

				expectCall(mocha.describe.only,
					[`Method method1`, sinon.match.func]);
				expectCall(strictDescribers.testUtils.mountTest,
					[createInstance, Test.prototype, 'method1', sinon.match.func]);
				expectCall(callback, []);
				expect(actualService).to.be.eq(test);
				expect(result).to.be.eq(undefined);
			});
		});

		describe('describeMethodSkip', () => {
			const bkp = mocha.describe.skip;
			let callback: sinon.SinonStub;
			let actualService: any;

			beforeEach(() => {
				callback = sinon.stub();
				sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake(
					(service, _cls, _method, cb) => {
						actualService = service();
						cb();
					},
				);
				mocha.describe.skip = sinon.stub().callsFake((_a, func) => func());
			});

			afterEach(() => {
				mocha.describe.skip = bkp;
			});

			it('should call describe', () => {
				const test = new Test();
				const createInstance = () => test;

				const result = strictDescribers.describeMethodSkip(createInstance, Test,
					'method1', callback);

				expectCall(mocha.describe.skip,
					[`Method method1`, sinon.match.func]);
				expectCall(strictDescribers.testUtils.mountTest,
					[createInstance, Test.prototype, 'method1', sinon.match.func]);
				expectCall(callback, []);
				expect(actualService).to.be.eq(test);
				expect(result).to.be.eq(undefined);
			});
		});
	});

	describe('static describers', () => {
		describe('describeStaticMethod', () => {
			const bkp = mocha.describe;
			let callback: sinon.SinonStub;
			let actualService: any;

			beforeEach(() => {
				callback = sinon.stub();
				sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake(
					(service, _cls, _method, cb) => {
						actualService = service();
						cb();
					},
				);
				(mocha as any).describe = sinon.stub().callsFake((_a, func) => func());
			});

			afterEach(() => {
				(mocha as any).describe = bkp;
			});

			it('should call describe', () => {

				const result = strictDescribers.describeStaticMethod(Test, 'staticMethod1', callback);

				expectCall(mocha.describe,
					[`Static method staticMethod1`, sinon.match.func]);
				expectCall(strictDescribers.testUtils.mountTest,
					[sinon.match.func, Test, 'staticMethod1', callback]);
				expectCall(callback, []);
				expect(actualService).to.be.eq(Test);
				expect(result).to.be.eq(undefined);
			});
		});

		describe('describeStaticMethodOnly', () => {
			const bkp = mocha.describe.only;
			let callback: sinon.SinonStub;
			let actualService: any;

			beforeEach(() => {
				callback = sinon.stub();
				sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake(
					(service, _cls, _method, cb) => {
						actualService = service();
						cb();
					},
				);
				mocha.describe.only = sinon.stub().callsFake((_a, func) => func());
			});

			afterEach(() => {
				mocha.describe.only = bkp;
			});

			it('should call describe', () => {

				const result = strictDescribers.describeStaticMethodOnly(Test, 'staticMethod1', callback);

				expectCall(mocha.describe.only,
					[`Static method staticMethod1`, sinon.match.func]);
				expectCall(strictDescribers.testUtils.mountTest,
					[sinon.match.func, Test, 'staticMethod1', callback]);
				expectCall(callback, []);
				expect(actualService).to.be.eq(Test);
				expect(result).to.be.eq(undefined);
			});
		});

		describe('describeStaticMethodSkip', () => {
			const bkp = mocha.describe.skip;
			let callback: sinon.SinonStub;
			let actualService: any;

			beforeEach(() => {
				callback = sinon.stub();
				sinon.stub(strictDescribers.testUtils, 'mountTest').callsFake(
					(service, _cls, _method, cb) => {
						actualService = service();
						cb();
					},
				);
				mocha.describe.skip = sinon.stub().callsFake((_a, func) => func());
			});

			afterEach(() => {
				mocha.describe.skip = bkp;
			});

			it('should call describe', () => {

				const result = strictDescribers.describeStaticMethodSkip(Test, 'staticMethod1', callback);

				expectCall(mocha.describe.skip,
					[`Static method staticMethod1`, sinon.match.func]);
				expectCall(strictDescribers.testUtils.mountTest,
					[sinon.match.func, Test, 'staticMethod1', callback]);
				expectCall(callback, []);
				expect(actualService).to.be.eq(Test);
				expect(result).to.be.eq(undefined);
			});
		});
	});
});
