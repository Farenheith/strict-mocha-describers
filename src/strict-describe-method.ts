import { TestFunction } from "mocha";
import { MethodTestFunction } from "./types/method-test-function";
import { testUtils } from "./test-utils";
import { ClassOf } from "./types/class-of";
import { MethodSuite } from "./types/method-suite";
import { StaticMethodSuite } from "./types/static-method-suite";
import { backupHelper } from "./backup-helper";
import { ItHelper } from "./it-helper";

export class StaticMethodDescribeHelper<Class> {
	constructor(protected readonly cls: Class) { }

	private createSingleStaticDescribe = (suite: (title: string, fn: () => void) => void) => {
		return (method: keyof Class, fn: (it: TestFunction) => void) => {
			suite(`Static method ${method}`, () => {
				const wrapper = {} as { backup: Array<[keyof Class, Class[keyof Class]]> };
				beforeEach(this.getBeforeEach(wrapper, method));

				fn(it);

				afterEach(this.getAfterEach(wrapper));
			});
		}
	}

	private getAfterEach(wrapper: { backup: Array<[keyof Class, Class[keyof Class]]>; }): Mocha.Func {
		return () => {
			backupHelper.restore(this.cls, wrapper.backup);
		};
	}

	private getBeforeEach(wrapper: { backup: Array<[keyof Class, Class[keyof Class]]>; }, method: keyof Class): Mocha.Func {
		return () => {
			wrapper.backup = testUtils.prepare(this.cls, this.cls, method);
		};
	}

	createStaticDescribe() {
		return testUtils.setupFunction(this.createSingleStaticDescribe, describe) as StaticMethodSuite<Class>;
	}
}

export class MethodDescribeHelper<Target, Class extends ClassOf<Target>> extends StaticMethodDescribeHelper<Class> {
	constructor(
		protected readonly bootstrap: () => Target,
		cls: Class
	) {
		super(cls);
	}

	private createMethodDescribe = (suite: (title: string, fn: () => void) => void) => {
		return (method: keyof Target,
			fn: (
					it: MethodTestFunction<Target>,
					getTarget: () => Target,
				) => void
		) => {
			const itHelper = new ItHelper(this.cls, this.bootstrap, method);
			const it = itHelper.createIt();

			suite(`Method ${method}`, () => {
				beforeEach(itHelper.beforeEach);

				fn(it, () => itHelper.target);

				afterEach(itHelper.afterEach);
			});
		}
	}

	createDescribe() {
		return testUtils.setupFunction(this.createMethodDescribe, describe) as MethodSuite<Target, Class>;
	}
}


