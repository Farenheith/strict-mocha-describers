import { testUtils } from './../src/test-utils';
import { expect } from 'chai';
import * as getFake from '../src/get-fake';
import * as sinon from 'sinon';

class Test {
	private hiddenMethod() { }
	visibleMethod() { }
	propertyMethod = () => this.hiddenMethod();
}

describe('get-fake.ts', () => {
	describe('fakeStaticClass', () => {
		let error: Error;
		try {
			getFake.fakeStaticClass(Test);
		} catch (err) {
			error = err;
		}

		beforeEach(() => {
			sinon.stub(testUtils, 'prepare').returns('method backups' as any);
		});

		it('should throw error when called outside test context', () => {
			expect(error).to.be.instanceOf(Error);
		});

		it ('should change all methods of class to fake when called on a valid context', () => {
			const result = getFake.fakeStaticClass(Test);

			expect(testUtils.prepare).to.have.been.calledOnceWithExactly(Test, Test);
			expect(result).to.be.undefined;
		});
	});

	describe('getFakeInstance', () => {
		beforeEach(() => {
			sinon.stub(testUtils, 'prepare').returns('method backups' as any);
		});

		it ('should create a new object and call prepare when create function is not informed', () => {
			const result = getFake.getFakeInstance(Test);

			expect(testUtils.prepare).to.have.been.calledOnceWithExactly(result, Test.prototype);
			expect(result).to.be.instanceOf(Test);
		});

		it ('should call create function and call prepare when create function is informed', () => {
			const instance = new Test();
			const create = sinon.stub().returns(instance);
			const result = getFake.getFakeInstance(Test, create);

			expect(create).to.have.been.calledOnceWithExactly();
			expect(testUtils.prepare).to.have.been.calledOnceWithExactly(instance, Test.prototype);
			expect(result).to.be.eq(instance);
		});
	});
})
