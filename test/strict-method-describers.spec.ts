import { expect } from 'chai';
import * as getFake from '../src/get-fake';
import * as strictDescribeClass from '../src/strict-describe-class';

describe('strict-method-describers.ts', () => {
  it('should export all expected methods', () => {
    const target = require('../src/strict-mocha-describers');

    expect(target).to.be.eql({
      ...getFake,
      dummy: getFake.getFakeInstance,
      staticDummy: getFake.fakeStaticClass,
      ...{
        describeClass: strictDescribeClass.describeClass,
        describeStaticClass: strictDescribeClass.describeStaticClass,
        describeStruct: strictDescribeClass.describeStruct,
      },
    });

    expect((describe as any).class).to.be.eq(strictDescribeClass.describeClass);
    expect((describe as any).struct).to.be.eq(
      strictDescribeClass.describeStruct,
    );
    expect(strictDescribeClass.describeClass.static).to.be.eq(
      strictDescribeClass.describeStaticClass,
    );
  });
});
