declare type ClassOf<T> = new () => T;
export declare const testUtils: {
    prepare<T>(service: T, prototype: T, methodToTest: keyof T): [string, Function][];
    mountTest<T_1>(service: () => T_1, prototype: T_1, methodName: keyof T_1, callback: () => any): void;
};
export declare function describeMethod<T>(service: () => T, cls: ClassOf<T>, methodName: keyof T, callback: () => any): void;
export declare function describeMethodOnly<T>(service: () => T, cls: ClassOf<T>, methodName: keyof T, callback: () => any): void;
export declare function describeMethodSkip<T>(service: () => T, cls: ClassOf<T>, methodName: keyof T, callback: () => any): void;
export declare function describeStaticMethod<T>(cls: T, methodName: keyof T, callback: () => any): void;
export declare function describeStaticMethodOnly<T>(cls: T, methodName: keyof T, callback: () => any): void;
export declare function describeStaticMethodSkip<T>(cls: T, methodName: keyof T, callback: () => any): void;
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
export declare const method: SuiteFunction;
export {};
