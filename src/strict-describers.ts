import * as mocha from 'mocha';

export type ClassOf<T> = (new () => T) & { prototype: T, name: string };

export const testUtils = {
	prepare<T>(service: T, prototype: T, methodToTest?: keyof T) {
		const methods: string[] = [];
		const backup: Array<[string, Function]> = [];
		for (const key of Object.getOwnPropertyNames(prototype)) {
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
			service[m] = () => {
				throw new Error('Not mocked yet');
			};
		});
  
		return backup;
	},

	mountTest<T>(service: () => T, prototype: T, methodName: keyof T, callback: () => any) {
		let backup: Array<[string, Function]>;
		let target: T;
  
		mocha.beforeEach(() => {
			target = service();
			backup = testUtils.prepare(target, prototype, methodName);
		});

		callback();

		mocha.afterEach(() => {
			for (const pair of backup) {
				(target as any)[pair[0]] = pair[1];
			}
		});
	},
};

export function describeMethod<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => any,
) {
	mocha.describe(`Method ${methodName}`, () => testUtils.mountTest(service, cls.prototype, methodName, callback));
}

export function describeMethodOnly<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => any,
) {
	mocha.describe.only(`Method ${methodName}`, () => testUtils.mountTest(service, cls.prototype, methodName, callback));
}

export function describeMethodSkip<T>(service: () => T, cls: ClassOf<T>,
	methodName: keyof T, callback: () => any,
) {
	mocha.describe.skip(`Method ${methodName}`, () => testUtils.mountTest(service, cls.prototype, methodName, callback));
}

export function describeStaticMethod<T>(cls: T,
	methodName: keyof T, callback: () => any,
) {
	mocha.describe(`Static method ${methodName}`, () => testUtils.mountTest(() => cls, cls, methodName, callback));
}

export function describeStaticMethodOnly<T>(cls: T,
	methodName: keyof T, callback: () => any,
) {
	mocha.describe.only(`Static method ${methodName}`,
		() => testUtils.mountTest(() => cls, cls, methodName, callback));
}

export function describeStaticMethodSkip<T>(cls: T,
	methodName: keyof T, callback: () => any,
) {
	mocha.describe.skip(`Static method ${methodName}`,
		() => testUtils.mountTest(() => cls, cls, methodName, callback));
}

interface BaseSuiteFunction {
	<T>(service: () => T, cls: ClassOf<T>, title: keyof T, fn: () => any): any;
}

interface BaseStaticSuiteFunction {
	<T>(cls: T, title: keyof T, fn: () => any): any;
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
