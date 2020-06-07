import { ClassOf } from './types/class-of';
import { testUtils } from './test-utils';

let cleanups: Function[] | undefined;

beforeEach(() => {
  cleanups = [];
});

afterEach(() => {
  cleanups!.forEach((x) => x());
  cleanups = undefined;
});

export function fakeStaticClass<Target>(cls: Target) {
  if (cleanups === undefined) {
    throw new Error('Invalid context. Call it inside a beforeEach ou it');
  }

  const backup = testUtils.prepare(cls, cls);

  cleanups.push(() => testUtils.restoreBackup(backup, cls));
}

export function getFakeInstance<Target, Class extends ClassOf<Target>>(
  cls: Class,
  create?: () => Target,
): Target {
  const result = create ? create() : new cls();
  testUtils.prepare(result, cls.prototype);
  return result;
}
