export declare type ClassOf<T> = (new (...params: any[]) => T) & {
    prototype: T;
    name: string;
};
export declare type MethodBackup<T> = [keyof T, T[keyof T]];
export declare const testUtils: {
    prepare<T>(service: T, prototype: T, methodToTest?: keyof T | undefined): MethodBackup<T>[];
    mountStaticTest<T_1>(cls: T_1, methodName: keyof T_1, callback: () => unknown): void;
    mountInstanceTest<T_2, Class extends ClassOf<T_2>>(service: () => T_2, cls: Class, methodName: keyof T_2, callback: () => unknown): void;
    restoreBackup<T_3>(backup: MethodBackup<T_3>[], target: T_3): void;
    isMockable<T_4>(key: keyof T_4, prototype: T_4, service: T_4, methodToTest?: keyof T_4 | undefined): boolean;
    getMockedMethod<T_5>(name: keyof T_5): T_5[keyof T_5];
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
