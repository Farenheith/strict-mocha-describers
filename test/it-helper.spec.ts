import { testUtils } from './../src/test-utils';
import * as sinon from 'sinon';
import { expect } from "chai";
import { backupHelper } from '../src/backup-helper';
import { ItHelper } from "../src/it-helper";

class Test {
	method1() { }
}
describe('ItHelper', () => {
	let instance: Test;
	let target: ItHelper<Test, typeof Test>;
	let bootstrap: sinon.SinonStub;

	beforeEach(() => {
		instance = new Test();
		bootstrap = sinon.stub().returns(instance);
		target = new ItHelper(Test, bootstrap, 'method1');
	});

	describe('.createSuiteCase()', () => {
		let testFunction: sinon.SinonStub;
		let fn: sinon.SinonStub;

		beforeEach(() => {
			testFunction = sinon.stub().callsFake((_description, callback) => callback());
			fn = sinon.stub().returns('fn result');
		});

		it('should create testCase function that calls original testFunction and callback chained', () => {
			const testCase = target['createSuiteCase'](testFunction);
			target['target'] = instance;

			const result = testCase('test description', fn);

			expect(testFunction).to.have.been.calledOnceWithExactly('test description', sinon.match.func);
			expect(fn).to.have.been.calledOnceWithExactly(instance);
			expect(result).to.be.eq('fn result');
			expect(bootstrap).to.have.not.been.called;
		});
	});

	describe('.createIt()', () => {
		beforeEach(() => {
			sinon.stub(testUtils, 'setupFunction').returns('setupFunction result' as any);
		});

		it('should setup it function properly', () => {
			const result = target.createIt();

			expect(testUtils.setupFunction).to.have.been.calledOnceWithExactly(target['createSuiteCase'], global.it);
			expect(result).to.be.eq('setupFunction result');
			expect(bootstrap).to.have.not.been.called;
		});
	});

	describe('.backupInstance()', () => {
		beforeEach(() => {
			sinon.stub(testUtils, 'prepare').callsFake(x => (x === instance ? 'instance backup' : 'class backup') as any);
		});

		it('should prepare target to be tested and keep backup of methods', () => {
			target['target'] = instance;
			const result = target['backupInstance']('method1');

			expect(testUtils.prepare).to.have.been.calledTwice
				.calledWithExactly(instance, Test.prototype, 'method1')
				.calledWithExactly(Test, Test);
			expect(result).to.be.undefined;
			expect(target['backup']).to.be.eq('instance backup');
			expect(target['staticBackup']).to.be.eq('class backup');
			expect(bootstrap).to.have.not.been.called;
		});
	});

	describe('.beforeEach', () => {
		beforeEach(() => {
			sinon.stub(target, 'backupInstance' as any);
		});

		it('should call bootstrap and backupInstance', () => {
			const result = target['beforeEach']();

			expect(bootstrap).to.have.been.calledOnceWithExactly();
			expect(target['backupInstance']).to.have.been.calledOnceWithExactly('method1');
		});
	});

	describe('.afterEach', () => {
		beforeEach(() => {
			sinon.stub(backupHelper, 'restore');
			target['target'] = instance;
			target['backup'] = 'instance backup' as any;
			target['staticBackup'] = 'class backup' as any;
		});

		it('should restore backup of instance and class', () => {
			const result = target['afterEach']();

			expect(backupHelper.restore).to.have.been.calledTwice
				.calledWithExactly(instance, 'instance backup')
				.calledWithExactly(Test, 'class backup');
			expect(bootstrap).to.have.not.been.called;
		});
	});
});
