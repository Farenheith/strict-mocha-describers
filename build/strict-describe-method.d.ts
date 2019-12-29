import { TestFunction } from "mocha";
import { ClassOf } from "./strict-describers";
import { MethodTestFunction } from "./strict-it";
export declare class StaticMethodDescribeHelper<Class> {
    protected readonly cls: Class;
    constructor(cls: Class);
    createSingleStaticDescribe(suite: (title: string, fn: () => void) => void): (method: keyof Class, fn: (it: TestFunction) => void) => void;
    createStaticDescribe(): StaticMethodSuite<Class>;
}
export declare class MethodDescribeHelper<Target, Class extends ClassOf<Target>> extends StaticMethodDescribeHelper<Class> {
    protected readonly bootstrap: () => Target;
    constructor(bootstrap: () => Target, cls: Class);
    createMethodDescribe(suite: (title: string, fn: () => void) => void): (method: keyof Target, fn: (it: MethodTestFunction<Target>, getTarget: () => Target) => void) => void;
    createDescribe(): MethodSuite<Target, Class>;
}
export interface BaseMethodSuite<Target> {
    (methodName: keyof Target, fn: (it: MethodTestFunction<Target>, getTarget: () => Target) => void): any;
}
export interface MethodSuite<Target, Class extends ClassOf<Target>> extends BaseMethodSuite<Target> {
    only: BaseMethodSuite<Target>;
    skip: BaseMethodSuite<Target>;
    static: StaticMethodSuite<Class>;
}
export interface BaseStaticMethodSuite<Class> {
    (methodName: keyof Class, fn: (it: TestFunction) => void): any;
}
export interface StaticMethodSuite<Class> extends BaseStaticMethodSuite<Class> {
    only: BaseStaticMethodSuite<Class>;
    skip: BaseStaticMethodSuite<Class>;
}
