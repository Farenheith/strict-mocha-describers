import { expect } from 'chai';
import { afterEach } from 'mocha';

describe('index.ts', () => {
	afterEach(() => {
		delete require[require.resolve('../src/strict-mocha-describers')];
	});

	it('should call strict-mocha-describers', () => {
		require('../src/index');

		expect((describe as any).class).to.be.not.undefined;
	});
});
