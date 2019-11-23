"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
chai.use((_chai, utils) => {
    chai.Assertion.addMethod('matchEql', function fn(expectedMatch) {
        const subject = utils.flag(this, 'object');
        const stub = sinon.stub();
        stub(subject);
        try {
            sinon.assert.calledWithMatch(stub, expectedMatch);
        }
        catch (error) {
            error.name = 'MatchAssertionError';
            error.message = error.message.replace(/^expected stub to be called with match/, `expected ${utils.objDisplay(subject)} to match`);
            throw error;
        }
    });
});
function expectCall(stub, ...parameters) {
    if (stub.callCount === undefined) {
        stub.callCount = 0;
    }
    chai.expect(stub.callCount)
        .eq(parameters.length, `Expected ${stub.name} to have been called ${parameters.length} times but it was called ${stub.callCount} times
`);
    for (let i = 0; i < parameters.length; i++) {
        chai.expect(stub.args[i])
            .matchEql(parameters[i], `Expected call #${i} of ${stub.name} to have been called with
[${parameters[i]}] but it was called with
[${stub.args[i]}]
`);
    }
}
exports.expectCall = expectCall;
//# sourceMappingURL=expect-call.js.map