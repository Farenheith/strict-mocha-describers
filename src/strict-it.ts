import { ClassOf } from './types/class-of';
import { testUtils } from './test-utils';
import { it as mochaIt } from "mocha";
import { MethodTestFunction } from "./types/method-test-function";
import { MethodBackup } from './types/method-backup';

export interface TestWrapper<Target, Class extends ClassOf<Target>> {
	target: Target;
	backup: Array<MethodBackup<Target>>;
	staticBackup: Array<MethodBackup<Class>>;
}

export const backupHelper = {
	restore<Target>(target: Target, backup: Array<MethodBackup<Target>>) {
		for (const pair of backup) {
			target[pair[0]] = pair[1];
		}
	}
}

export class ItHelper<Target, Class extends ClassOf<Target>> {
	readonly wrapper: TestWrapper<Target, Class>;

	constructor(
		private readonly cls: Class,
		private readonly bootstrap: () => Target,
		private readonly method: keyof Target,
	) {
		this.wrapper = {} as TestWrapper<Target, Class>;
	}

	createSuiteCase(testFunction: Function) {
		return (description: string, fn: (target: Target) => void | PromiseLike<void>) => {
			return testFunction(description, () => {
				return fn(this.wrapper.target);
			});
		}
	}

	createIt() {
		return testUtils.setupFunction(this.createSuiteCase.bind(this), mochaIt) as MethodTestFunction<Target>;
	}

	backupInstance(method: keyof Target) {
		this.wrapper.backup = testUtils.prepare(
			this.wrapper.target,
			this.cls.prototype,
			method
		);
		this.wrapper.backup = testUtils.prepare(
			this.cls,
			this.cls.prototype,
		);
	}

	beforeEach = () => {
		this.wrapper.target = this.bootstrap();
		this.backupInstance(this.method);
	}

	afterEach = () => {
		backupHelper.restore(this.wrapper.target, this.wrapper.backup);
		backupHelper.restore(this.cls, this.wrapper.staticBackup);
	}
}


