import { expect } from 'chai';
import * as getFake from '../src/get-fake';
import * as strictDescribeClass from '../src/strict-describe-class';

describe('index.ts', () => {
	it('should export all expected methods', () => {
		const target = require('../src/strict-mocha-describers');

		console.log(Object.getOwnPropertyNames(target));
		expect(target).to.be.eql({
			...getFake,
			...{
				describeClass: strictDescribeClass.describeClass,
				describeStaticClass: strictDescribeClass.describeStaticClass,
				describeStruct: strictDescribeClass.describeStruct,
			},
		});

		expect((describe as any).class).to.be.eq(strictDescribeClass.describeClass);
		expect((describe as any).struct).to.be.eq(strictDescribeClass.describeStruct);
		expect(strictDescribeClass.describeClass.static).to.be.eq(strictDescribeClass.describeStaticClass);
	});
});
