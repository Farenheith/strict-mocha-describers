import * as mocha from 'mocha';

export type ClassOf<T> = (new (...params: unknown[]) => T) & { prototype: T, name: string };
export type MethodBackup<T> = [keyof T, T[keyof T]];

export const testUtils = {
	prepare<T>(service: T, prototype: T, methodToTest?: keyof T) {
		const methods: Array<keyof T> = [];
		const backup: Array<MethodBackup<T>> = [];
		for (const key of Object.getOwnPropertyNames(prototype) as Array<keyof T>) {
			if (key !== methodToTest
				&& typeof prototype[key] === 'function'
				// for instance methods
				&& ((
						service !== prototype
						&& key !== 'constructor'
				// for static classes
					) || (
						service === prototype
						&& key !== 'apply'
						&& key !== 'bind'
						&& key !== 'call'
						&& key !== 'toString'
					))) {
				methods.push(key);
			}
		}
  
		methods.forEach((m) => {
			backup.push([m, service[m]]);
			service[m] = (() => {
				throw new Error('Not mocked yet');
			}) as unknown as T[keyof T];
		});
  
		return backup;
	},

	mountTest<T>(service: () => T, prototype: T, methodName: keyof T, callback: () => unknown) {
		let backup: Array<MethodBackup<T>>;
		let target: T;
  
		mocha.beforeEach(() => {
			target = service();
			backup = testUtils.prepare(target, prototype, methodName);
		});

		callback();

		mocha.afterEach(() => {
			for (const pair of backup) {
				target[pair[0]] = pair[1] as unknown as T[keyof T];
			}
		});
	},
};

export function describeMethod<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe(`Method ${methodName}`, () => testUtils.mountTest(service, cls.prototype, methodName, callback));
}

export function describeMethodOnly<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe.only(`Method ${methodName}`, () => testUtils.mountTest(service, cls.prototype, methodName, callback));
}

export function describeMethodSkip<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe.skip(`Method ${methodName}`, () => testUtils.mountTest(service, cls.prototype, methodName, callback));
}

export function describeStaticMethod<T>(cls: T,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe(`Static method ${methodName}`, () => testUtils.mountTest(() => cls, cls, methodName, callback));
}

export function describeStaticMethodOnly<T>(cls: T,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe.only(`Static method ${methodName}`,
		() => testUtils.mountTest(() => cls, cls, methodName, callback));
}

export function describeStaticMethodSkip<T>(cls: T,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe.skip(`Static method ${methodName}`,
		() => testUtils.mountTest(() => cls, cls, methodName, callback));
}

interface BaseSuiteFunction {
	<T>(service: () => T, cls: ClassOf<T>, title: keyof T, fn: () => unknown): unknown;
}

interface BaseStaticSuiteFunction {
	<T>(cls: T, title: keyof T, fn: () => unknown): unknown;
}

interface StaticSuiteFunction extends BaseStaticSuiteFunction {
	only: BaseStaticSuiteFunction;
	skip: BaseStaticSuiteFunction;
}

interface SuiteFunction extends BaseSuiteFunction {
	only: BaseSuiteFunction;
	skip: BaseSuiteFunction;
	static: StaticSuiteFunction;
}

export const method = describeMethod as SuiteFunction;
method.only = describeMethodOnly;
method.skip = describeMethodSkip;
method.static = describeStaticMethod as StaticSuiteFunction;
method.static.only = describeStaticMethodOnly;
method.static.skip = describeStaticMethodSkip;
