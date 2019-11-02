import { expect } from 'chai'
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);

export function expectCall(stub: sinon.SinonStub | any, ...parameters: any[][]) {
    expect((stub as sinon.SinonStub).callCount).eql(parameters.length);
    expect((stub as sinon.SinonStub).args).eql(parameters);
}