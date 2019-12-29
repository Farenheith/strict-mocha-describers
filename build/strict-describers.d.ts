export declare type ClassOf<T> = (new (...params: unknown[]) => T) & {
    prototype: T;
    name: string;
};
export declare type MethodBackup<T> = [keyof T, T[keyof T]];
export declare const testUtils: {
    prepare<T>(service: T, prototype: T, methodToTest?: keyof T | undefined): MethodBackup<T>[];
    mountTest<T_1>(service: () => T_1, prototype: T_1, methodName: keyof T_1, callback: () => unknown): void;
};
export declare function describeMethod<T>(service: () => T, cls: ClassOf<T>, methodName: keyof T, callback: () => unknown): void;
export declare function describeMethodOnly<T>(service: () => T, cls: ClassOf<T>, methodName: keyof T, callback: () => unknown): void;
export declare function describeMethodSkip<T>(service: () => T, cls: ClassOf<T>, methodName: keyof T, callback: () => unknown): void;
export declare function describeStaticMethod<T>(cls: T, methodName: keyof T, callback: () => unknown): void;
export declare function describeStaticMethodOnly<T>(cls: T, methodName: keyof T, callback: () => unknown): void;
export declare function describeStaticMethodSkip<T>(cls: T, methodName: keyof T, callback: () => unknown): void;
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
export declare const method: SuiteFunction;
export {};
