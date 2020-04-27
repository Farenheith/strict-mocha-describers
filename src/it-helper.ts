import { ClassOf } from './types/class-of';
import { testUtils } from './test-utils';
import { MethodTestFunction } from "./types/method-test-function";
import { backupHelper } from './backup-helper';
import { MethodBackup } from './types/method-backup';

const mochaIt = global.it;

export class ItHelper<Target, Class extends ClassOf<Target>> {
	target!: Target;
	private backup!: Array<MethodBackup<Target>>;
	private staticBackup!: Array<MethodBackup<Class>>;

	constructor(
		private readonly cls: Class,
		private readonly bootstrap: () => Target,
		private readonly method: keyof Target,
	) { }

	private createSuiteCase = (testFunction: Function) => {
		return (description: string, fn: (target: Target) => void | PromiseLike<void>) => {
			return testFunction(description, () => {
				return fn(this.target);
			});
		}
	}

	createIt() {
		return testUtils.setupFunction(this.createSuiteCase, mochaIt) as MethodTestFunction<Target>;
	}

	private backupInstance(method: keyof Target) {
		this.backup = testUtils.prepare(
			this.target,
			this.cls.prototype,
			method
		);
		this.staticBackup = testUtils.prepare(
			this.cls,
			this.cls,
		);
	}

	readonly beforeEach = () => {
		this.target = this.bootstrap();
		this.backupInstance(this.method);
	}

	readonly afterEach = () => {
		backupHelper.restore(this.target, this.backup);
		backupHelper.restore(this.cls, this.staticBackup);
	}
}


