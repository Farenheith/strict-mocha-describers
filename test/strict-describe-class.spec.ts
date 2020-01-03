import * as methodHelper from './../src/strict-describe-method';
import { expect } from 'chai';
import * as getFake from '../src/get-fake';
import * as strictDescribeClass from '../src/strict-describe-class';
import * as sinon from 'sinon';

describe('index.ts', () => {
	it('should export all expected methods', () => {
		const target = require('../src/strict-mocha-describers');

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

	class Test { }

	describe('mountClassDescribe()', () => {
		let fn: sinon.SinonStub;
		let suite: sinon.SinonStub;
		let createDescribe: sinon.SinonStub;

		beforeEach(() => {
			createDescribe = sinon.stub().returns('createDescribe result' as any);
			sinon.stub(methodHelper, 'MethodDescribeHelper').returns({ createDescribe });
			fn = sinon.stub();
			suite = sinon.stub().callsFake((_description, callback) => callback());
		});

		it('should return class Describer that uses MethodDescribeHelper.createDescribe', () => {
			const describer = strictDescribeClass.mountClassDescribe(suite);

			const result = describer(Test, 'bootStrapFunction' as any, fn);

			expect(suite).to.have.been.calledOnceWithExactly('class Test', sinon.match.func);
			expect(methodHelper.MethodDescribeHelper).to.have.been.calledOnceWithExactly('bootStrapFunction', Test);
			expect(createDescribe).to.have.been.calledOnceWithExactly();
			expect(fn).to.have.been.calledOnceWithExactly('createDescribe result');
			expect(result).to.be.undefined;
		});
	});

	describe('mountStaticClassDescribe()', () => {
		let fn: sinon.SinonStub;
		let suite: sinon.SinonStub;
		let createStaticDescribe: sinon.SinonStub;

		beforeEach(() => {
			createStaticDescribe = sinon.stub().returns('createStaticDescribe result' as any);
			sinon.stub(methodHelper, 'StaticMethodDescribeHelper').returns({ createStaticDescribe });
			fn = sinon.stub();
			suite = sinon.stub().callsFake((_description, callback) => callback());
		});

		it('should return static class Describer that uses MethodDescribeHelper.createStaticDescribe', () => {
			const describer = strictDescribeClass.mountStaticClassDescribe(suite);

			const result = describer(Test, fn);

			expect(suite).to.have.been.calledOnceWithExactly('static class Test', sinon.match.func);
			expect(methodHelper.StaticMethodDescribeHelper).to.have.been.calledOnceWithExactly(Test);
			expect(createStaticDescribe).to.have.been.calledOnceWithExactly();
			expect(fn).to.have.been.calledOnceWithExactly('createStaticDescribe result');
			expect(result).to.be.undefined;
		});
	});

	describe('mountSructDescribe()', () => {
		let fn: sinon.SinonStub;
		let suite: sinon.SinonStub;
		let createStaticDescribe: sinon.SinonStub;

		beforeEach(() => {
			createStaticDescribe = sinon.stub().returns('createStaticDescribe result' as any);
			sinon.stub(methodHelper, 'StaticMethodDescribeHelper').returns({ createStaticDescribe });
			fn = sinon.stub();
			suite = sinon.stub().callsFake((_description, callback) => callback());
		});

		it('should return struct Describer that uses MethodDescribeHelper.createStaticDescribe', () => {
			const describer = strictDescribeClass.mountSructDescribe(suite);

			const result = describer(Test, 'describe description', fn);

			expect(suite).to.have.been.calledOnceWithExactly('describe description', sinon.match.func);
			expect(methodHelper.StaticMethodDescribeHelper).to.have.been.calledOnceWithExactly(Test);
			expect(createStaticDescribe).to.have.been.calledOnceWithExactly();
			expect(fn).to.have.been.calledOnceWithExactly('createStaticDescribe result');
			expect(result).to.be.undefined;
		});
	});
});
