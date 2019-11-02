import { expect } from 'chai'
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);

export function expectCall(stub: sinon.SinonStub | any, ...parameters: any[][]) {
    expect((stub as sinon.SinonStub).callCount)
        .eql(parameters.length, `Expected ${
            (stub as sinon.SinonStub).name
        } to have been called ${parameters.length} times but it was called ${
            (stub as sinon.SinonStub).callCount
        } times.`);
    for (let i = 0; i < parameters.length; i++) {
        expect((stub as sinon.SinonStub).args[i])
            .eql(parameters[i], `Expected ${
                (stub as sinon.SinonStub).name
            } to have been called with [${
                parameters[i]
            }] but it was called with [${
                (stub as sinon.SinonStub).args[i]
            }]`);
    }
}