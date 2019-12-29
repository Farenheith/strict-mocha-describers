import * as mocha from 'mocha';

// tslint:disable-next-line: no-any
export type ClassOf<T> = (new (...params: any[]) => T) & { prototype: T, name: string };
export type MethodBackup<T> = [keyof T, T[keyof T]];

export const testUtils = {
	prepare<T>(service: T, prototype: T, methodToTest?: keyof T) {
		const methods: Array<keyof T> = [];
		const backup: Array<MethodBackup<T>> = [];
		for (const key of Object.getOwnPropertyNames(prototype) as Array<keyof T>) {
			if (testUtils.isMockable<T>(key, prototype, service, methodToTest)) {
				methods.push(key);
			}
		}
  
		methods.forEach((m) => {
			backup.push([m, service[m]]);
			service[m] = testUtils.getMockedMethod<T>(m);
		});
  
		return backup;
	},

	mountStaticTest<T>(cls: T, methodName: keyof T, callback: () => unknown) {
		let backup: Array<MethodBackup<T>>;
		let target: T;
  
		mocha.beforeEach(() => {
			target = cls;
			backup = testUtils.prepare(target, cls, methodName);
		});

		callback();

		mocha.afterEach(() => {
			testUtils.restoreBackup<T>(backup, target);
		});
	},

	mountInstanceTest<T, Class extends ClassOf<T>>(
		service: () => T, cls: Class, methodName: keyof T, callback: () => unknown
	) {
		let backup: Array<MethodBackup<T>>;
		let staticBackup: Array<MethodBackup<Class>>;
		let target: T;
  
		mocha.beforeEach(() => {
			target = service();
			backup = testUtils.prepare(target, cls.prototype, methodName);
			staticBackup = testUtils.prepare(cls, cls);
		});

		callback();

		mocha.afterEach(() => {
			testUtils.restoreBackup<T>(backup, target);
			testUtils.restoreBackup<Class>(staticBackup, cls);
		});
	},

	restoreBackup<T>(backup: Array<MethodBackup<T>>, target: T) {
		for (const pair of backup) {
			target[pair[0]] = pair[1];
		}
	},

	isMockable<T>(key: keyof T, prototype: T, service: T, methodToTest?: keyof T) {
		return key !== methodToTest
			&& typeof prototype[key] === 'function'
			// for instance methods
			&& ((service !== prototype
				&& key !== 'constructor'
				// for static classes
			) || (service === prototype
				&& key !== 'apply'
				&& key !== 'bind'
				&& key !== 'call'
				&& key !== 'toString'));
	},
	
	getMockedMethod<T>(name: keyof T): T[keyof T] {
		const result: T[keyof T] = eval(`(function ${name} () { throw new Error('${name} not mocked yet'); })`);
		return result;
	}
};

export function describeMethod<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe(`Method ${methodName}`,
		() => testUtils.mountInstanceTest(service, cls, methodName, callback));
}

export function describeMethodOnly<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe.only(`Method ${methodName}`,
		() => testUtils.mountInstanceTest(service, cls, methodName, callback));
}

export function describeMethodSkip<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe.skip(`Method ${methodName}`,
		() => testUtils.mountInstanceTest(service, cls, methodName, callback));
}

export function describeStaticMethod<T>(cls: T,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe(`Static method ${methodName}`,
		() => testUtils.mountStaticTest(cls, methodName, callback));
}

export function describeStaticMethodOnly<T>(cls: T,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe.only(`Static method ${methodName}`,
		() => testUtils.mountStaticTest(cls, methodName, callback));
}

export function describeStaticMethodSkip<T>(cls: T,
	methodName: keyof T, callback: () => unknown,
) {
	mocha.describe.skip(`Static method ${methodName}`,
		() => testUtils.mountStaticTest(cls, methodName, callback));
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
