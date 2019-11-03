declare type ClassOf<T> = new () => T;
export declare function prepare<T>(service: T, prototype: T, methodToTest: keyof T): [string, Function][];
interface BaseSuiteFunction {
    <T>(service: () => T, cls: ClassOf<T>, title: keyof T, fn: () => any): any;
}
interface BaseStaticSuiteFunction {
    <T>(cls: ClassOf<T>, title: keyof ClassOf<T>, fn: () => any): any;
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
