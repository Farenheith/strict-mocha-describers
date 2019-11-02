"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
function expectCall(stub, ...parameters) {
    chai_1.expect(stub.callCount).eql(parameters.length);
    chai_1.expect(stub.args).eql(parameters);
}
exports.expectCall = expectCall;
//# sourceMappingURL=expect-call.js.map