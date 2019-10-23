import { describe, beforeEach, afterEach } from 'mocha';

export function prepare<T>(service: any, prototype: any, methodToTest: keyof T) {
  const methods: string[] = [];
  const backup: [string, Function][] = [];
  for (const key of Object.getOwnPropertyNames(prototype)) {
    if (key !== methodToTest
      && key !== 'constructor'
      && typeof prototype[key] === 'function') {
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
}

function mountTest<T>(service: () => T, cls: any, methodName: keyof T, callback: () => any) {
  let backup: [string, Function][];
  let target: T;

  beforeEach(() => {
    target = service();
    backup = prepare(target, cls.prototype, methodName);
  });
  callback();
  afterEach(() => {
    for (const pair of backup) {
      (target as any)[pair[0]] = pair[1];
    }
  });
}

function describeMethod<T>(service: () => T, cls: any,
  methodName: keyof T, callback: () => any,
) {
  describe(`Method ${methodName}`, () => mountTest(service, cls, methodName, callback));
}

function describeMethodOnly<T>(service: () => T, cls: any,
  methodName: keyof T, callback: () => any,
) {
  describe.only(`Method ${methodName}`, () => mountTest(service, cls, methodName, callback));
}

function describeMethodSkip<T>(service: () => T, cls: any,
  methodName: keyof T, callback: () => any,
) {
  describe.skip(`Method ${methodName}`, () => mountTest(service, cls, methodName, callback));
}

function describeStaticMethod<T>(cls: any,
  methodName: keyof T, callback: () => any,
) {
  describe(`Static method ${methodName}`, () => mountTest(() => cls, cls, methodName, callback));
}

function describeStaticMethodOnly<T>(cls: any,
  methodName: keyof T, callback: () => any,
) {
  describe.only(`Static method ${methodName}`,
    () => mountTest(() => cls, cls, methodName, callback));
}

function describeStaticMethodSkip<T>(cls: any,
  methodName: keyof T, callback: () => any,
) {
  describe.skip(`Static method ${methodName}`,
    () => mountTest(() => cls, cls, methodName, callback));
}

interface BaseSuiteFunction {
  <T>(service: () => T, cls: any, title: keyof T, fn: () => any): any;
}

interface BaseStaticSuiteFunction {
  <T>(cls: any, title: keyof T, fn: () => any): any;
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
