import { expect as expectMocha } from 'mocha';
import { expect } from 'chai'
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);

export function expectCall(stub: sinon.SinonStub | any, ...parameters: any[][]) {
    (expect(stub) as expectMocha).callCount(parameters.length);
    expect(stub.args).to.be.eql(parameters);
}