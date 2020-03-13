import { testUtils } from './../src/test-utils';
import * as sinon from 'sinon';

import { expect } from 'chai';
class Test {
	property1 = 'teste';

	method1() {
		return 'result1';
	}

	method2() {
		return 'result2';
	}

	method3 = () => 'result3';

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

describe('testUtils', () => {
	describe('prepare', () => {
		it('should remove all instance methods except method2', () => {
			const obj = new Test();
			let error: Error | undefined;

			testUtils.prepare(obj, Test.prototype, 'method2');

			try {
				obj.method1();
			} catch (err) {
				error = err;
			}
			expect(error!.message).to.be.eq('method1 not mocked yet');
			error = undefined;
			try {
				obj.method3();
			} catch (err) {
				error = err;
			}
			expect(error!.message).to.be.eq('method3 not mocked yet');
			expect(obj.method2()).to.be.eq('result2');
		});

		it('should replace behavior of instance method', () => {
			const obj = new Test();
			let error: Error | undefined;

			testUtils.prepare(obj, Test.prototype, 'method2');
			sinon.stub(obj, 'method1').returns('mocked');

			expect(obj.method1()).to.be.eq('mocked');
			try {
				obj.method3();
			} catch (err) {
				error = err;
			}
			expect(error!.message).to.be.eq('method3 not mocked yet');
			expect(obj.method2()).to.be.eq('result2');
		});

		it('should remove all static methods except method2', () => {
			let error: Error | undefined;

			testUtils.prepare(Test, Test, 'staticMethod2');

			try {
				Test.staticMethod1();
			} catch (err) {
				error = err;
			}
			expect(error!.message).to.be.eq('staticMethod1 not mocked yet');
			error = undefined;
			try {
				Test.staticMethod3();
			} catch (err) {
				error = err;
			}
			expect(error!.message).to.be.eq('staticMethod3 not mocked yet');
			expect(Test.staticMethod2()).to.be.eq('static result2');
		});

		it('should replace behavior of static method', () => {
			let error: Error | undefined;

			testUtils.prepare(Test, Test, 'staticMethod2');
			sinon.stub(Test, 'staticMethod1').returns('mocked');

			expect(Test.staticMethod1()).to.be.eq('mocked');
			try {
				Test.staticMethod3();
			} catch (err) {
				error = err;
			}
			expect(error!.message).to.be.eq('staticMethod3 not mocked yet');
			expect(Test.staticMethod2()).to.be.eq('static result2');
		});
	});

	describe('mountInstanceTest', () => {
		const test = new Test();
		let callback: sinon.SinonStub;
		let service: sinon.SinonStub;

		beforeEach(() => {
			service = sinon.stub().returns(test);
			sinon.stub(global, 'beforeEach').callsFake(x => (x as any)());
			callback = sinon.stub();
			sinon.stub(testUtils, 'prepare').returns([
			['test1', 'value1'],
				['test2', 'value2'],
			] as any);
			sinon.stub(global, 'afterEach').callsFake(x => (x as any)());
		});

		it('should mount a test describer correctly', () => {
			const result = testUtils.mountInstanceTest(
				service, Test, 'method1', callback);

			expect(global.beforeEach).calledOnceWithExactly(sinon.match.func);
			expect(service).calledOnceWithExactly();
			expect(testUtils.prepare).calledTwice
				.calledWithExactly(test, Test.prototype, 'method1')
				.calledWithExactly(Test, Test);
			expect(callback).calledOnceWithExactly();
			expect(global.afterEach).calledOnceWithExactly(sinon.match.func);
			expect(result).eq(undefined);
			expect((test as any).test1).eq('value1');
			expect((test as any).test2).eq('value2');
		});
	});

	describe('mountStaticTest', () => {
		let callback: sinon.SinonStub;

		beforeEach(() => {
			sinon.stub(global, 'beforeEach').callsFake(x => (x as any)());
			callback = sinon.stub();
			sinon.stub(testUtils, 'prepare').returns([
			['test1', 'value1'],
				['test2', 'value2'],
			] as any);
			sinon.stub(global, 'afterEach').callsFake(x => (x as any)());
		});

		it('should mount a test describer correctly', () => {
			const result = testUtils.mountStaticTest(
				Test, 'staticMethod1', callback
			);

			expect(global.beforeEach).calledOnceWithExactly(sinon.match.func);
			expect(testUtils.prepare)
				.calledOnceWithExactly(Test, Test, 'staticMethod1');
			expect(callback).calledOnceWithExactly();
			expect(global.afterEach).calledOnceWithExactly(sinon.match.func);
			expect(result).eq(undefined);
			expect((Test as any).test1).eq('value1');
			expect((Test as any).test2).eq('value2');
		});
	});
});
