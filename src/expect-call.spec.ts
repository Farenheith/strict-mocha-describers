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
	method() {
		return undefined;
	}
}
describe('expect-call', () => {
	afterEach(() => {
		sinon.restore();
	});

	describe('expectCall', () => {
		const oldExpect = chai.expect;
		let expectStub: sinon.SinonStub;
		let eq: sinon.SinonStub;
		let matchEql: sinon.SinonStub;
		let target: Test;
		let stub: sinon.SinonStub;

		beforeEach(() => {
			target = new Test();
			eq = sinon.stub();
			matchEql = sinon.stub();
			expectStub = (chai as any).expect = sinon.stub()
				.returns({ eq, matchEql } as any);
			stub = sinon.stub(target, 'method').named('method');
		});

		afterEach(() => {
			(chai as any).expect = oldExpect;
		});

		it('should assert 0 calls if no array of parameters is informed', () => {
			(stub.callCount as any) = undefined;
			const result = expectCall(stub);

			oldExpect(expectStub.callCount).eq(1);
			oldExpect(expectStub.args[0]).eql([ 0 ]);
			oldExpect(eq.callCount).eq(1);
			oldExpect(eq.args[0]).eql([0,
				`Expected method to have been called 0 times but it was called 0 times
`]);
			oldExpect(matchEql.callCount).eq(0);
			oldExpect(result).eq(undefined);
		});

		it('should assert 2 calls if 2 arrays of parameters is informed', () => {
			stub.callCount = 1;
			stub.args[0] = ['params1'];
			const result = expectCall(stub,
				['param1', 'param2', 'param3'],
				['param1', 'param2']);

			oldExpect(expectStub.callCount).eq(3);
			oldExpect(expectStub.args[0]).eql([1]);
			oldExpect(eq.callCount).eq(1);
			oldExpect(eq.args[0]).eql([
				2,
				'Expected method to have been called 2 times but it was called 1 times\n'
			]);
			oldExpect(matchEql.callCount).eq(2);
			oldExpect(matchEql.args[0]).eql([
				["param1", "param2", "param3"],
				`Expected call #0 of method to have been called with
[param1,param2,param3] but it was called with
[params1]
`
			]);
			oldExpect(matchEql.args[1]).eql([
				["param1", "param2"],
	`Expected call #1 of method to have been called with
[param1,param2] but it was called with
[undefined]
`
			]);
			oldExpect(result).eq(undefined);
		});
	});

	describe('expectCall', () => {
		let stub: sinon.SinonStub;
		beforeEach(() => {
			stub = sinon.stub();
			stub(1, '2', true);
			stub('1', 2, false);
		});

		it('should accept first parameter comparison and reject second one', () => {
			let error!: Error;
			try {
				expectCall(stub,
					[1, sinon.match.string, true],
					['1', sinon.match.number, sinon.match.string]);
			} catch (err) {
				error = err;
			}
			expect(error.message.replace(/\033/g, '\\033')).eq(`expected [ '1', 2, false ] to match 
\\033[31m["1", 2, false]\\033[0m \\033[32m["1", typeOf("number"), typeOf("string")]\\033[0m `);
		});
	});
});
