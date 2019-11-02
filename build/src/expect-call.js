"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
function expectCall(stub, ...parameters) {
    chai_1.expect(stub.callCount)
        .eql(parameters.length, `Expected ${stub.name} to have been called ${parameters.length} times but it was called ${stub.callCount} times.`);
    for (let i = 0; i < parameters.length; i++) {
        chai_1.expect(stub.args[i])
            .eql(parameters[i], `Expected ${stub.name} to have been called with [${parameters[i]}] but it was called with [${stub.args[i]}]`);
    }
}
exports.expectCall = expectCall;
//# sourceMappingURL=expect-call.js.map