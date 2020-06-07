import { backupHelper } from './../src/backup-helper';
import { testUtils } from './../src/test-utils';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { StaticMethodDescribeHelper } from '../src/static-method-describe-helper';
import { MethodBackup } from '../src/types/method-backup';

class Test {
  static method1() {
    return undefined;
  }
}

describe('StaticMethodDescribeHelper', () => {
  let target: StaticMethodDescribeHelper<typeof Test>;

  beforeEach(() => {
    target = new StaticMethodDescribeHelper(Test);
  });

  describe('.createSingleStaticDescribe()', () => {
    let suite: sinon.SinonStub;
    let fn: sinon.SinonStub;

    beforeEach(() => {
      suite = sinon.stub().callsFake((_description, callback) => callback());
      fn = sinon.stub();
      sinon.stub(global, 'beforeEach');
      sinon.stub(global, 'afterEach');
      sinon
        .stub(target, 'getBeforeEach' as any)
        .returns('getBeforeEach result');
      sinon.stub(target, 'getAfterEach' as any).returns('getAfterEach result');
    });

    it('should return a static Method Describer', () => {
      const describer = target['createSingleStaticDescribe'](suite);

      const result = describer('method1', fn);

      expect(suite).to.have.been.calledOnceWithExactly(
        'Static method method1',
        sinon.match.func,
      );
      expect(target['getBeforeEach']).to.have.been.calledOnceWithExactly(
        {},
        'method1',
      );
      expect(global.beforeEach).to.have.been.calledOnceWithExactly(
        'getBeforeEach result',
      );
      expect(fn).to.have.been.calledOnceWithExactly(it);
      expect(target['getAfterEach']).to.have.been.calledOnceWithExactly({});
      expect(global.afterEach).to.have.been.calledOnceWithExactly(
        'getAfterEach result',
      );
      expect(result).to.be.undefined;
    });
  });

  describe('.getBeforeEach()', () => {
    beforeEach(() => {
      sinon.stub(testUtils, 'prepare').returns('methods backup' as any);
    });

    it('should return beforeEachCallBack that calls testUtils.prepare and keep resultant methods backup', () => {
      const wrapper = {} as { backup: Array<MethodBackup<Test>> };
      const beforeEachCallBack = target['getBeforeEach'](wrapper, 'method1');

      const result = (beforeEachCallBack as Function)({} as any);

      expect(testUtils.prepare).to.have.been.calledOnceWithExactly(
        Test,
        Test,
        'method1',
      );
      expect(wrapper.backup).to.be.eq('methods backup');
      expect(result).to.be.undefined;
    });
  });

  describe('.getAfterEach()', () => {
    beforeEach(() => {
      sinon.stub(backupHelper, 'restore');
    });

    it('should return beforeEachCallBack that calls testUtils.prepare and keep resultant methods backup', () => {
      const wrapper = { backup: 'methods backup' } as any;
      const afterEachCallBack = target['getAfterEach'](wrapper);

      const result = (afterEachCallBack as Function)({} as any);

      expect(backupHelper.restore).to.have.been.calledOnceWithExactly(
        Test,
        'methods backup',
      );
      expect(result).to.be.undefined;
    });
  });

  describe('.createStaticDescribe()', () => {
    beforeEach(() => {
      sinon
        .stub(testUtils, 'setupFunction')
        .returns('setupFunction result' as any);
    });

    it('should setup describe function using createSingleStaticDescribe method', () => {
      const result = target.createStaticDescribe();

      expect(testUtils.setupFunction).to.have.been.calledOnceWithExactly(
        target['createSingleStaticDescribe'],
        describe,
      );
      expect(result).to.be.eq('setupFunction result');
    });
  });
});
