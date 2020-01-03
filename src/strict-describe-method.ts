import { TestFunction } from "mocha";
import { MethodTestFunction, TestWrapper, ItHelper } from "./strict-it";
import { testUtils } from "./test-utils";
import { ClassOf } from "./types/Class-of";
import { MethodBackup } from "./types/method-backup";

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
		const result = this.createSingleStaticDescribe(describe) as StaticMethodSuite<Class>;
		result.skip = this.createSingleStaticDescribe(describe.skip);
		result.only = this.createSingleStaticDescribe(describe.only);

		return result;
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
		const result = this.createMethodDescribe(describe) as MethodSuite<Target, Class>;
		result.skip = this.createMethodDescribe(describe.skip);
		result.only = this.createMethodDescribe(describe.only);
		result.static = this.createStaticDescribe();

		return result;
	}
}

export interface BaseMethodSuite<Target> {
	(methodName: keyof Target, fn: (it: MethodTestFunction<Target>, getTarget: () => Target) => void): void;
}

export interface MethodSuite<Target, Class extends ClassOf<Target>> extends BaseMethodSuite<Target> {
	only: BaseMethodSuite<Target>;
	skip: BaseMethodSuite<Target>;
	static: StaticMethodSuite<Class>;
}

export interface BaseStaticMethodSuite<Class> {
	(methodName: keyof Class, fn: (it: TestFunction) => void): void;
}

export interface StaticMethodSuite<Class> extends BaseStaticMethodSuite<Class> {
	only: BaseStaticMethodSuite<Class>;
	skip: BaseStaticMethodSuite<Class>;
}
