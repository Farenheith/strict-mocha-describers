export interface TestWrapper<Target> {
    target: Target;
}
export declare class ItHelper<Target> {
    private readonly targetWrapper;
    constructor(targetWrapper: TestWrapper<Target>);
    createSuiteCase(testFunction: (description: string, fn: () => void | PromiseLike<void>) => void | PromiseLike<void>): (description: string, fn: (target: Target) => void | PromiseLike<void>) => void | PromiseLike<void>;
    createIt(): MethodTestFunction<Target>;
}
export interface BaseInstanceTestFunction<Target> {
    (description: string, callback: (target: Target) => any): any;
}
export interface MethodTestFunction<Target> extends BaseInstanceTestFunction<Target> {
    only: BaseInstanceTestFunction<Target>;
    skip: BaseInstanceTestFunction<Target>;
}
