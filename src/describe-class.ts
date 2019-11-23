import { describe, beforeEach, it as mochaIt, TestFunction } from 'mocha';
import { ClassOf, testUtils } from './strict-describers';

interface BootStrapperReturn<Target, Services> {
	target: Target,
	services: Services | undefined,
}

type TestCaseConf = 'only' | 'skip';

interface GeneralInstanceTests<Target, Services> {
	[key: string]: MethodTestSuite<Target, Services>;
}

type InstanceTests<Target, Services> = {
	[key in keyof Target]: MethodTestSuite<Target, Services>;
};

interface GeneralStaticTests<Target> {
	[key: string]: StaticMethodTestCase<Target>;
}

type StaticTests<Target> = {
	[key in keyof ClassOf<Target>]: StaticMethodTestCase<Target>;
};

export function mountTests<Target, Services>(cls: ClassOf<Target>,
	bootStrapper: () => BootStrapperReturn<Target, Services>,
	testSuites: TestSuites<Target, Services>,
) {
	if (testSuites.static) {
		if (testSuites.static.methods) {
			mountStaticTests<Target>(testSuites.static.methods,
				cls, 'Static methods', false);
		}
		
		if (testSuites.static.privateMethods) {
			mountStaticTests<Target>(testSuites.static.privateMethods,
				cls, 'Private static methods', true);
		}

		if (testSuites.static.general) {
			mountStaticTests<Target>(testSuites.static.general,
				cls, 'General static tests', false);
		}
	}

	if (testSuites.instance) {
		if (testSuites.instance.methods) {
			mountInstanceTests<Target, Services>(bootStrapper, testSuites.instance.methods,
				cls, 'Instance methods', true);
		}

		if (testSuites.instance.privateMethods) {
			mountInstanceTests<Target, Services>(bootStrapper, testSuites.instance.privateMethods,
				cls, 'Instance methods', true);
		}

		if (testSuites.instance.general) {
			mountInstanceTests<Target, Services>(bootStrapper, testSuites.instance.general,
				cls, 'General instance tests', false);
		}
	}
}

export function mountInstanceTests<Target, Services>(
	bootStrapper: () => BootStrapperReturn<Target, Services>,
	instanceTests: GeneralInstanceTests<Target, Services>,
	cls: ClassOf<Target>,
	title: string,
	prepare: boolean,
) {
	describe(title, () => {
		let bootStrap: BootStrapperReturn<Target, Services>;
		beforeEach(() => bootStrap = bootStrapper());
		describe('', () => {
			for (const method of Object.getOwnPropertyNames(instanceTests)) {
				const testCase = instanceTests[method];
				const it = getIt(() => bootStrap.target, () => bootStrap.services);
				const callback = () => mountTestCase(() => bootStrap.target, cls.prototype, method, () =>
					testCase.tests(it), prepare);
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
	callback: () => any,
	prepare: boolean,
) {
	let backup: Array<[string, Function]>;
	let target: T;

	beforeEach(() => {
		target = getTarget();
		if (prepare) {
			backup = testUtils.prepare(target, prototype, methodName);
		}
	});

	callback();

	if (prepare) {
		afterEach(() => {
			for (const pair of backup) {
				(target as any)[pair[0]] = pair[1];
			}
		});
	}
}

export function mountStaticTests<Target>(
	staticTests: StaticTests<Target>,
	cls: ClassOf<Target>,
	title: string,
	prepare: boolean,
) {
	describe(title, () => {
		for (const method of Object.getOwnPropertyNames(staticTests) as Array<keyof ClassOf<Target>>) {
			const testCase = staticTests[method] as StaticMethodTestCase<Target>;
			const callback = () => mountTestCase(() => cls, cls, method, () => testCase.tests(mochaIt), prepare);
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

export interface TestSuites<Target, Services> {
	instance?: {
		methods?: InstanceTests<Target, Services>,
		privateMethods?: GeneralInstanceTests<Target, Services>,
		general?: GeneralInstanceTests<Target, Services>,
	}
	static?: {
		methods?: StaticTests<Target>,
		privateMethods?: GeneralStaticTests<Target>,
		general?: GeneralStaticTests<Target>,
	}
}

/**
 * A describer to create a Test Suite for a single class.
 * Using this describer is way to enforce a strict organization in the unit test,
 * where 3 sections are enforced to be written separetely, defnined by the paremeters this method receives
 * @param cls the class you want to test 
 * @param bootStrapper method used to create the target instance for the test and the mocked services.
 * It's recommended for all mocked services to be just empty objects but with the correct type.
 * This way, you can stub the methods each method test suite will need and so you can garantee that will
 * be any other code being ran during your test that is not you intented to.
 * @param testSuites test suites is wrapper object for 6 kind of test cases:
 * first, suites are separated by instance and static. The difference between those is that the bootstrapper
 * are not ran for the static tests, as they're intended to static methods.
 * after that, you have three categories on each one: methods, privateMethods and general.
 * For general, there's no trick, it just a usual test. For the other ones, you must specify the name
 * of an existing method. During the test, the only method that will be real is the specified one. Any other method of the class
 * will throw an error. This behavior helps to eliminate scope invasion during the tests, and you're assured that no other code
 * other than the method being tested will run.
 */
export function describeClass<Target, Services>	(
	cls: ClassOf<Target>,
	bootStrapper: () => BootStrapperReturn<Target, Services>,
	testSuites: TestSuites<Target, Services>,
) {
	describe(`Class ${cls.name}`, () => {
		mountTests<Target, Services>(cls, bootStrapper, testSuites);
	});
}

export namespace describeClass {
	export function only<Target, Services>	(
		cls: ClassOf<Target>,
		bootStrapper: () => BootStrapperReturn<Target, Services>,
		testSuites: TestSuites<Target, Services>,
	) {
		describe.only(`Class ${cls.name}`, () => {
			mountTests<Target, Services>(cls, bootStrapper, testSuites);
		});
	}

	export function skip<Target, Services>	(
		cls: ClassOf<Target>,
		bootStrapper: () => BootStrapperReturn<Target, Services>,
		testSuites: TestSuites<Target, Services>,
	) {
		describe.skip(`Class ${cls.name}`, () => {
			mountTests<Target, Services>(cls, bootStrapper, testSuites);
		});
	}
}
