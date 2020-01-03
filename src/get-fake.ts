import { ClassOf } from "./types/class-of";
import { beforeEach, afterEach } from 'mocha';
import { testUtils } from './test-utils';

export function getFakeInstance<Target, Class extends ClassOf<Target>>(cls: Class): Target {
	const result = {} as { [key in keyof Target]: Target[keyof Target] } & Target;
	for (const key of Object.getOwnPropertyNames(cls.prototype) as Array<keyof Target>) {
		if (testUtils.isMockable<Target>(key, cls.prototype, result)) {
			result[key] = testUtils.getMockedMethod(key);
		}
	}
	return result;
}

let cleanups: Function[] | undefined;

beforeEach(() => {
	cleanups = [];
});

afterEach(() => {
	if (cleanups) {
		cleanups.forEach(x => x());
		cleanups = undefined;
	}
});

export function fakeStaticClass<Target>(cls: Target) {
	if (cleanups === undefined) {
		throw new Error('Invalid context. Call it inside a beforeEach ou it');
	}

	const backup = testUtils.prepare(cls, cls);

	cleanups.push(() => testUtils.restoreBackup(backup, cls));
}

