import { expect } from 'chai';
import * as getFake from '../src/get-fake';
import * as strictDescribeClass from '../src/strict-describe-class';

describe('index.ts', () => {
	it('should export all expected methods', () => {
		const target = require('../src/index');

		expect(target).to.be.eql({
			...getFake,
			...{
				describeClass: strictDescribeClass.describeClass,
				describeStaticClass: strictDescribeClass.describeStaticClass,
				describeSruct: strictDescribeClass.describeSruct
			},
		});
	});
});
