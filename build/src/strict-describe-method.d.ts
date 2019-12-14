import { TestFunction } from "mocha";
import { ClassOf } from "./strict-describers";
import { MethodTestFunction } from "./strict-it";
export declare class StaticMethodDescribeHelper<Target> {
    protected readonly cls: ClassOf<Target>;
    constructor(cls: ClassOf<Target>);
    createSingleStaticDescribe(suite: (title: string, fn: () => void) => void): (method: "prototype" | "name", fn: (it: TestFunction) => void) => void;
    createStaticDescribe(): StaticMethodSuite<Target>;
}
export declare class MethodDescribeHelper<Target> extends StaticMethodDescribeHelper<Target> {
    protected readonly bootstrap: () => Target;
    constructor(bootstrap: () => Target, cls: ClassOf<Target>);
    createMethodDescribe(suite: (title: string, fn: () => void) => void): (method: keyof Target, fn: (it: MethodTestFunction<Target>) => void) => void;
    createDescribe(): MethodSuite<Target>;
}
export interface BaseMethodSuite<Target> {
    (methodName: keyof Target, fn: (it: MethodTestFunction<Target>) => void): any;
}
export interface MethodSuite<Target> extends BaseMethodSuite<Target> {
    only: BaseMethodSuite<Target>;
    skip: BaseMethodSuite<Target>;
    static: StaticMethodSuite<Target>;
}
export interface BaseStaticMethodSuite<Target> {
    (methodName: keyof ClassOf<Target>, fn: (it: TestFunction) => void): any;
}
export interface StaticMethodSuite<Target> extends BaseStaticMethodSuite<Target> {
    only: BaseStaticMethodSuite<Target>;
    skip: BaseStaticMethodSuite<Target>;
}
