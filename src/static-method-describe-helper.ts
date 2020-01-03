import { TestFunction } from "mocha";
import { testUtils } from "./test-utils";
import { StaticMethodSuite } from "./types/static-method-suite";
import { backupHelper } from "./backup-helper";
import { beforeEach, afterEach, it } from 'mocha';

export class StaticMethodDescribeHelper<Class> {
	constructor(protected readonly cls: Class) { }

	private createSingleStaticDescribe = (suite: (title: string, fn: () => void) => void) => {
		return (method: keyof Class, fn: (it: TestFunction) => void) => {
			suite(`Static method ${method}`, () => {
				const wrapper = {} as {
					backup: Array<[keyof Class, Class[keyof Class]]>;
				};
				beforeEach(this.getBeforeEach(wrapper, method));
				fn(it);
				afterEach(this.getAfterEach(wrapper));
			});
		};
	};

	private getBeforeEach(wrapper: {
		backup: Array<[keyof Class, Class[keyof Class]]>;
	}, method: keyof Class): Mocha.Func {
		return () => {
			wrapper.backup = testUtils.prepare(this.cls, this.cls, method);
		};
	}

	private getAfterEach(wrapper: {
		backup: Array<[keyof Class, Class[keyof Class]]>;
	}): Mocha.Func {
		return () => {
			backupHelper.restore(this.cls, wrapper.backup);
		};
	}

	createStaticDescribe() {
		return testUtils.setupFunction(this.createSingleStaticDescribe, describe) as StaticMethodSuite<Class>;
	}
}
