import * as ItHelper from './../src/it-helper';
import { testUtils } from '../src/test-utils';
import { expect } from 'chai';
import sinon = require('sinon');
import * as mocha from 'mocha';
import { MethodDescribeHelper } from '../src/method-describe-helper';

class Test {
	method1() { }
}

describe('MethodDescribeHelper', () => {
	let target: MethodDescribeHelper<Test, typeof Test>;
	let instance: Test;

	beforeEach(() => {
		instance = new Test();
		target = new MethodDescribeHelper(() => instance, Test);
	});

	describe('.createMethodDescribe()', () => {
		let suite: sinon.SinonStub;
		let fn: sinon.SinonStub;
		let targetInstance: Test | undefined;
		let createIt: sinon.SinonStub;
		let createStaticDescribe: sinon.SinonStub<any, any>;
		const itHelperBeforeEach: any = 'beforeEachCallback';
		const itHelperAfterEach: any = 'afterEachCallback';

		beforeEach(() => {
			targetInstance = undefined;
			suite = sinon.stub().callsFake((_description, callback) => callback());
			fn = sinon.stub().callsFake((_it, getTarget) => targetInstance = getTarget());
			sinon.stub(mocha, 'beforeEach');
			sinon.stub(mocha, 'afterEach');
			createIt = sinon.stub().returns('createIt result');
			createStaticDescribe = sinon.stub(target, 'createStaticDescribe')
				.returns('createStaticDescribe result' as any);
			sinon.stub(ItHelper, 'ItHelper').returns({
				createIt, beforeEach: itHelperBeforeEach, afterEach: itHelperAfterEach,
				target: instance,
			});
		});

		it('should return a method describer', () => {
			const describer = target['createMethodDescribe'](suite);

			const result = describer('method1', fn);

			expect(suite).to.have.been.calledOnceWithExactly('Method method1', sinon.match.func);
			expect(mocha.beforeEach).to.have.been.calledOnceWithExactly('beforeEachCallback');
			expect(fn).to.have.been.calledOnceWithExactly('createIt result', sinon.match.func);
			expect(mocha.afterEach).to.have.been.calledOnceWithExactly('afterEachCallback');
			expect(result).to.be.undefined;
			expect(targetInstance).to.be.eq(instance);
			expect(describer.static).to.be.eq('createStaticDescribe result');
		});
	});

	describe('.createDescribe()', () => {
		beforeEach(() => {
			sinon.stub(testUtils, 'setupFunction').returns('setupFunction result' as any);
		});

		it('should setup describe function using createMethodDescribe method', () => {
			const result = target.createDescribe();

			expect(testUtils.setupFunction).to.have.been.calledOnceWithExactly(
				target['createMethodDescribe'], describe
			);
			expect(result).to.be.eq('setupFunction result');
		});
	});
});
