export declare function prepare<T>(service: any, prototype: any, methodToTest: keyof T): [string, Function][];
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
export declare const method: SuiteFunction;
export {};
