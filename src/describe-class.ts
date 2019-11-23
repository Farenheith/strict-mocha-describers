import { describe, beforeEach, it as mochaIt, TestFunction } from 'mocha';
import { ClassOf, testUtils } from './strict-describers';

interface BootStrapperReturn<Target, Services> {
	target: Target,
	services: Services | undefined,
}

type TestCaseConf = 'only' | 'skip';

type InstanceTests<Target, Services> = {
	[key in keyof Target]: MethodTestSuite<Target, Services>;
};

type StaticTests<Target> = {
	[key in keyof ClassOf<Target>]: StaticMethodTestCase<Target>;
};

export function mountTests<Target, Services>(cls: ClassOf<Target>,
	staticTests: StaticTests<Target> | undefined,
	bootStrapper: () => BootStrapperReturn<Target, Services>,
	instanceTests: InstanceTests<Target, Services>,
) {
	if (staticTests) {
		mountStaticTests<Target>(staticTests, cls);
	}

	mountInstanceTests<Target, Services>(bootStrapper, instanceTests, cls);
}

export function mountInstanceTests<Target, Services>(
	bootStrapper: () => BootStrapperReturn<Target, Services>,
	instanceTests: InstanceTests<Target, Services>,
	cls: ClassOf<Target>
) {
	describe('instance methods', () => {
		let bootStrap: BootStrapperReturn<Target, Services>;
		beforeEach(() => bootStrap = bootStrapper());
		describe('', () => {
			for (const method of Object.getOwnPropertyNames(instanceTests)) {
				const testCase = instanceTests[method as keyof Target];
				const it = getIt(() => bootStrap.target, () => bootStrap.services);
				const callback = () => mountTestCase(() => bootStrap.target, cls.prototype, method, () =>
					testCase.tests(it));
				switch (testCase.flag) {
					case 'only':
						describe.only(`.${method}()`, callback);
						break;
					case 'skip':
						describe.skip(`.${method}()`, callback);
						break;
					default:
						describe(`.${method}()`, callback);
				}
			}
		});
	});
}

interface BaseInstanceTestFunction<Target, Services> {
	(description: string, callback: (target: Target, services: Services) => any);
	
}

interface InstanceTestFunction<Target, Services> extends BaseInstanceTestFunction<Target, Services> {
	only: BaseInstanceTestFunction<Target, Services>;
	skip: BaseInstanceTestFunction<Target, Services>;
}

export function getIt<Target, Services>(getTarget: () => Target, getServices: () => Services) {
	const result  = ((description: string, callback: (target: Target, services: Services) => any) => {
		return mochaIt(description, () => callback(getTarget(), getServices()));
	}) as InstanceTestFunction<Target, Services>;

	result.only = ((description: string, callback: (target: Target, services: Services) => any) => {
		return mochaIt.only(description, () => callback(getTarget(), getServices()));
	}) as BaseInstanceTestFunction<Target, Services>;

	result.skip = ((description: string, callback: (target: Target, services: Services) => any) => {
		return mochaIt.skip(description, () => callback(getTarget(), getServices()));
	}) as BaseInstanceTestFunction<Target, Services>;

	return result;
}

export function mountTestCase<T>(
	getTarget: () => T,
	prototype: T,
	methodName: keyof T,
	callback: () => any
) {
	let backup: Array<[string, Function]>;
	let target: T;

	beforeEach(() => {
		target = getTarget();
		backup = testUtils.prepare(target, prototype, methodName);
	});

	callback();

	afterEach(() => {
		for (const pair of backup) {
			(target as any)[pair[0]] = pair[1];
		}
	});
}

export function mountStaticTests<Target>(
	staticTests: StaticTests<Target>,
	cls: ClassOf<Target>,
) {
	describe('static methods', () => {
		for (const method of Object.getOwnPropertyNames(staticTests) as Array<keyof ClassOf<Target>>) {
			const testCase = staticTests[method] as StaticMethodTestCase<Target>;
			const callback = () => mountTestCase(() => cls, cls, method, () => testCase.tests(mochaIt));
			switch (testCase.flag) {
				case 'only':
					describe.only(`.${method}()`, callback);
					break;
				case 'skip':
					describe.skip(`.${method}()`, callback);
					break;
				default:
					describe(`.${method}()`, callback);
			}
		}
	});
}

export interface MethodTestSuite<Target, Services> {
	readonly flag?: TestCaseConf;
	tests(it: InstanceTestFunction<Target, Services | undefined>): void;
}

export interface StaticMethodTestCase<Target> {
	readonly flag?: TestCaseConf;
	tests(it: TestFunction): void;
}

export function describeClass<Target, Services>	(
	cls: ClassOf<Target>,
	bootStrapper: () => BootStrapperReturn<Target, Services>,
	instanceTests: InstanceTests<Target, Services>,
	staticTests?: StaticTests<Target>,
) {
	describe(`Class ${cls.name}`, () => {
		mountTests<Target, Services>(cls, staticTests, bootStrapper, instanceTests);
	});
}

export namespace describeClass {
	export function only<Target, Services>	(
		cls: ClassOf<Target>,
		bootStrapper: () => BootStrapperReturn<Target, Services>,
		instanceTests: InstanceTests<Target, Services>,
		staticTests?: StaticTests<Target>,
	) {
		describe.only(`Class ${cls.name}`, () => {
			mountTests<Target, Services>(cls, staticTests, bootStrapper, instanceTests);
		});
	}

	export function skip<Target, Services>	(
		cls: ClassOf<Target>,
		bootStrapper: () => BootStrapperReturn<Target, Services>,
		instanceTests: InstanceTests<Target, Services>,
		staticTests?: StaticTests<Target>,
	) {
		describe.skip(`Class ${cls.name}`, () => {
			mountTests<Target, Services>(cls, staticTests, bootStrapper, instanceTests);
		});
	}
}
