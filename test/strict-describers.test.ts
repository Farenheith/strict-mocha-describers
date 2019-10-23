import { describe, it } from 'mocha';
import { prepare } from '../src/strict-describers';
import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);

class Test {
    property1 = 'teste';

    method1() {
        return 'result1';
    }

    method2() {
        return 'result2';
    }

    method3() {
        return 'result3';
    }
}
  
describe('TestUtils', () => {
    describe('prepare', () => {
        it('should remove all methods except method2', () => {
        const obj = new Test();
        let error: Error | undefined;

        prepare(obj, Test.prototype, 'method2');

        try {
            obj.method1();
        } catch (err) {
            error = err;
        }
        expect(error!.message).to.be.eq('Not mocked yet');
        error = undefined;
        try {
            obj.method3();
        } catch (err) {
            error = err;
        }
        expect(error!.message).to.be.eq('Not mocked yet');
        expect(obj.method2()).to.be.eq('result2');
        });

        it('should replace behavior of method', () => {
        const obj = new Test();
        let error: Error | undefined;

        prepare(obj, Test.prototype, 'method2');
        sinon.stub(obj, 'method1').returns('mocked');

        expect(obj.method1()).to.be.eq('mocked');
        try {
            obj.method3();
        } catch (err) {
            error = err;
        }
        expect(error!.message).to.be.eq('Not mocked yet');
        expect(obj.method2()).to.be.eq('result2');
        });
    });
});