"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
function expectCall(stub, parameters) {
    mocha_1.expect(stub).callCount(parameters.length);
    mocha_1.expect(stub.args).to.be.eql(parameters);
}
exports.expectCall = expectCall;
//# sourceMappingURL=expect-call.js.map