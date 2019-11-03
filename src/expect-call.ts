import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.use((_chai, utils) => {
chai.Assertion.addMethod('matchEql', function fn(expectedMatch) {
		const subject = utils.flag(this, 'object');
		const stub = sinon.stub();
		stub(subject);
		try {
			sinon.assert.calledWithMatch(stub, expectedMatch);
		} catch (error) {
			error.name = 'MatchAssertionError';
			error.message = error.message.replace(
				/^expected stub to be called with match/,
				`expected ${utils.objDisplay(subject)} to match`
			);
			throw error;
		}
	});
});
  
export function expectCall(stub: sinon.SinonStub | any, ...parameters: any[][]) {
	if ((stub as sinon.SinonStub).callCount === undefined) {
		(stub as sinon.SinonStub).callCount = 0;
	}
	chai.expect((stub as sinon.SinonStub).callCount)
		.eq (parameters.length, `Expected ${
			(stub as sinon.SinonStub).name
		} to have been called ${parameters.length} times but it was called ${
			(stub as sinon.SinonStub).callCount
		} times
`);

	for (let i = 0; i < parameters.length; i++) {
		(chai.expect((stub as sinon.SinonStub).args[i]) as any)
			.matchEql(parameters[i], `Expected call #${i} of ${
				(stub as sinon.SinonStub).name
			} to have been called with
[${parameters[i]}] but it was called with
[${(stub as sinon.SinonStub).args[i]}]
`);
	}
}
