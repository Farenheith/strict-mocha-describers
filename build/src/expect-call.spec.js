"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const expect_call_1 = require("./expect-call");
chai.use(sinonChai);
class Test {
    method() {
        return undefined;
    }
}
mocha_1.describe('expect-call', () => {
    mocha_1.afterEach(() => {
        sinon.restore();
    });
    mocha_1.describe('expectCall', () => {
        const oldExpect = chai.expect;
        let expectStub;
        let eq;
        let matchEql;
        let target;
        let stub;
        mocha_1.beforeEach(() => {
            target = new Test();
            eq = sinon.stub();
            matchEql = sinon.stub();
            expectStub = chai.expect = sinon.stub()
                .returns({ eq, matchEql });
            stub = sinon.stub(target, 'method').named('method');
        });
        mocha_1.afterEach(() => {
            chai.expect = oldExpect;
        });
        mocha_1.it('should assert 0 calls if no array of parameters is informed', () => {
            stub.callCount = undefined;
            const result = expect_call_1.expectCall(stub);
            oldExpect(expectStub.callCount).eq(1);
            oldExpect(expectStub.args[0]).eql([0]);
            oldExpect(eq.callCount).eq(1);
            oldExpect(eq.args[0]).eql([0,
                `Expected method to have been called 0 times but it was called 0 times
`]);
            oldExpect(matchEql.callCount).eq(0);
            oldExpect(result).eq(undefined);
        });
        mocha_1.it('should assert 2 calls if 2 arrays of parameters is informed', () => {
            stub.callCount = 1;
            stub.args[0] = ['params1'];
            const result = expect_call_1.expectCall(stub, ['param1', 'param2', 'param3'], ['param1', 'param2']);
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
    mocha_1.describe('expectCall', () => {
        let stub;
        mocha_1.beforeEach(() => {
            stub = sinon.stub();
            stub(1, '2', true);
            stub('1', 2, false);
        });
        mocha_1.it('should accept first parameter comparison and reject second one', () => {
            let error;
            try {
                expect_call_1.expectCall(stub, [1, sinon.match.string, true], ['1', sinon.match.number, sinon.match.string]);
            }
            catch (err) {
                error = err;
            }
            chai_1.expect(error.message.replace(/\033/g, '\\033')).eq(`expected [ '1', 2, false ] to match 
\\033[31m["1", 2, false]\\033[0m \\033[32m["1", typeOf("number"), typeOf("string")]\\033[0m `);
        });
    });
});
//# sourceMappingURL=expect-call.spec.js.map