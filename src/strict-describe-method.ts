import { TestFunction } from "mocha";
import { ClassOf, testUtils } from "./strict-describers";
import { MethodTestFunction, TestWrapper, ItHelper } from "./strict-it";

export class MethodDescribeHelper<Target> {
	constructor(
		private readonly bootstrap: () => Target,
		private readonly cls: ClassOf<Target>) { }

	createMethodDescribe(suite: (title: string, fn: () => void) => void) {
		return (method: keyof Target, fn: (it: MethodTestFunction<Target>) => void) => {
			const wrapper = {} as TestWrapper<Target>;
			const itHelper = new ItHelper(wrapper);
			const it = itHelper.createIt();
			let backup: Array<[string, Function]>;
			suite(`method ${method}`, () => {
				beforeEach(() => {
					wrapper.target = this.bootstrap();
					backup = testUtils.prepare(
						wrapper.target,
						this.cls.prototype,
						method
					);
				});

				fn(it);

				afterEach(() => {
					for (const pair of backup) {
						(wrapper.target as any)[pair[0]] = pair[1];
					}
				});
			});
		}
	}

	createStaticDescribe(suite: (title: string, fn: () => void) => void) {
		return (method: keyof ClassOf<Target>, fn: (it: TestFunction) => void) => {
			suite(`static method ${method}`, () => {
				let backup: Array<[string, Function]>;
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
						(this.cls as any)[pair[0]] = pair[1];
					}
				});
			});
		}
	}

	createDescribe() {
		const result = this.createMethodDescribe(describe) as MethodSuite<Target>;
		result.skip = this.createMethodDescribe(describe.skip);
		result.only = this.createMethodDescribe(describe.only);
		result.static = this.createStaticDescribe(describe) as StaticMethodSuite<Target>;
		result.static.skip = this.createStaticDescribe(describe.skip);
		result.static.only = this.createStaticDescribe(describe.only);

		return result;
	}
}


export interface BaseMethodSuite<Target> {
	(methodName: keyof Target, fn: (it: MethodTestFunction<Target>) => void);
}

export interface MethodSuite<Target> extends BaseMethodSuite<Target> {
	only: BaseMethodSuite<Target>;
	skip: BaseMethodSuite<Target>;
	static: StaticMethodSuite<Target>;
}

export interface BaseStaticMethodSuite<Target> {
	(methodName: keyof ClassOf<Target>, fn: (it: TestFunction) => void);
}

export interface StaticMethodSuite<Target> extends BaseStaticMethodSuite<Target> {
	only: BaseStaticMethodSuite<Target>;
	skip: BaseStaticMethodSuite<Target>;
}
