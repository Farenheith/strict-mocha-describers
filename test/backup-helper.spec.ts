import { backupHelper } from './../src/backup-helper';
import { ItHelper } from '../src/it-helper';
import * as sinon from 'sinon';
import { expect } from 'chai';

class Test {
  method1() {
    return undefined;
  }
}
describe('backupHelper', () => {
  describe('.restore()', () => {
    it('should restore backup to targe object', () => {
      const target = {} as any;

      const result = backupHelper.restore(target, [
        ['k1', 'v1'],
        ['k2', 22],
        ['k3', true],
      ]);

      expect(target).to.be.eql({
        k1: 'v1',
        k2: 22,
        k3: true,
      });
    });
  });
});
