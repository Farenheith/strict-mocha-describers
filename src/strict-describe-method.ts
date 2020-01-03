import { TestFunction } from "mocha";
import { TestWrapper, ItHelper } from "./strict-it";
import { MethodTestFunction } from "./types/method-test-function";
import { testUtils } from "./test-utils";
import { ClassOf } from "./types/class-of";
import { MethodBackup } from "./types/method-backup";
import { MethodSuite } from "./types/method-suite";
import { StaticMethodSuite } from "./types/static-method-suite";

export class StaticMethodDescribeHelper<Class> {
	constructor(protected readonly cls: Class) { }

	createSingleStaticDescribe(suite: (title: string, fn: () => void) => void) {
		return (method: keyof Class, fn: (it: TestFunction) => void) => {
			suite(`static method ${method}`, () => {
				let backup: Array<[keyof Class, Class[keyof Class]]>;
				beforeEach(() => {
					backup = testUtils.prepare(
						this.cls,
						this.cls,
						method
					);
				});

				fn(it);

				afterEach(() => {
					for (const pair of backup) {
						this.cls[pair[0]] = pair[1];
					}
				});
			});
		}
	}

	createStaticDescribe() {
		return testUtils.setupFunction(this.createSingleStaticDescribe.bind(this), describe) as StaticMethodSuite<Class>;
	}
}

export class MethodDescribeHelper<Target, Class extends ClassOf<Target>> extends StaticMethodDescribeHelper<Class> {
	constructor(
		protected readonly bootstrap: () => Target,
		cls: Class
	) {
		super(cls);
	}

	createMethodDescribe(suite: (title: string, fn: () => void) => void) {
		return (method: keyof Target,
			fn: (
					it: MethodTestFunction<Target>,
					getTarget: () => Target,
				) => void
		) => {
			const wrapper = {} as TestWrapper<Target>;
			const itHelper = new ItHelper(wrapper);
			const it = itHelper.createIt();
			let backup: Array<MethodBackup<Target>>;
			let staticBackup: Array<MethodBackup<Class>>;
			suite(`method ${method}`, () => {
				beforeEach(() => {
					wrapper.target = this.bootstrap();
					backup = testUtils.prepare(
						wrapper.target,
						this.cls.prototype,
						method
					);
					staticBackup = testUtils.prepare(
						this.cls,
						this.cls,
					);
				});

				fn(it, () => wrapper.target);

				afterEach(() => {
					for (const pair of backup) {
						wrapper.target[pair[0]] = pair[1];
					}
					for (const pair of staticBackup) {
						this.cls[pair[0]] = pair[1];
					}
				});
			});
		}
	}

	createDescribe() {
		return testUtils.setupFunction(this.createMethodDescribe.bind(this), describe) as MethodSuite<Target, Class>;
	}
}


