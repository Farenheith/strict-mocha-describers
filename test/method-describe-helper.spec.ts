import * as ItHelper from './../src/it-helper';
import { backupHelper } from '../src/backup-helper';
import { testUtils } from '../src/test-utils';
import * as methodHelper from '../src/method-describe-helper';
import { expect } from 'chai';
import * as getFake from '../src/get-fake';
import * as strictDescribeClass from '../src/strict-describe-class';
import * as sinon from 'sinon';
import { StaticMethodDescribeHelper } from '../src/static-method-describe-helper';
import * as mocha from 'mocha';
import { MethodBackup } from '../src/types/method-backup';
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
		const itHelperBeforeEach: any = 'beforeEachCallback';
		const itHelperAfterEach: any = 'afterEachCallback';

		beforeEach(() => {
			targetInstance = undefined;
			suite = sinon.stub().callsFake((_description, callback) => callback());
			fn = sinon.stub().callsFake((_it, getTarget) => targetInstance = getTarget());
			sinon.stub(mocha, 'beforeEach');
			sinon.stub(mocha, 'afterEach');
			createIt = sinon.stub().returns('createIt result');
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
