import { BaseMochaType } from './types/base-mocha-function';
import { MethodBackup } from "./types/method-backup";
import * as mocha from 'mocha';
import { ClassOf } from "./types/class-of";

export const testUtils = {
	prepare<T>(service: T, prototype: T, methodToTest?: keyof T) {
		const backup: Array<MethodBackup<T>> = [];
		const subjects = testUtils.getSubjects<T>(prototype, service);
		const methods = testUtils.getMockableMethods<T>(subjects, service, methodToTest);
		testUtils.createBackup<T>(methods, backup, service);
		return backup;
	},

	getSubjects<T>(prototype: T, service: T) {
		const subjects = [prototype];
		if (service !== prototype) {
			subjects.push(service);
		}
		return subjects;
	},

	getMockableMethods<T>(subjects: T[], service: T, methodToTest: keyof T | undefined) {
		const methods: Array<keyof T> = [];
		for (const subject of subjects) {
			for (const key of Object.getOwnPropertyNames(subject) as Array<keyof T>) {
				if (testUtils.isMockable<T>(key, subject, service, methodToTest)) {
					methods.push(key);
				}
			}
		}

		return methods;
	},

	createBackup<T>(methods: Array<keyof T>, backup: Array<MethodBackup<T>>, service: T) {
		methods.forEach((m) => {
			backup.push([m, service[m]]);
			service[m] = testUtils.getMockedMethod<T>(m);
		});
	},

	mountStaticTest<T>(cls: T, methodName: keyof T, callback: () => void | PromiseLike<void>) {
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

	mountInstanceTest<T, Class extends ClassOf<T>>(service: () => T, cls: Class, methodName: keyof T, callback: () => void | PromiseLike<void>) {
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
	},

	setupFunction<A extends Function, B extends Function>(transformer: (a: A) => B, mochaBase: BaseMochaType<A>) {
		const result = transformer(mochaBase) as BaseMochaType<B>;
		result.skip = transformer(mochaBase.skip);
		result.only = transformer(mochaBase.only);

		return result;
	},
};

