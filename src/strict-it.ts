import { it as mochaIt } from "mocha";

export interface TestWrapper<Target> {
	target: Target;
	it: MethodTestFunction<Target>;
}

export class ItHelper<Target> {
	constructor(private readonly targetWrapper: TestWrapper<Target>) { }

	createSuiteCase(testFunction: (description: string, fn: () => void | PromiseLike<void>) => void | PromiseLike<void>) {
		return (description: string, fn: (target: Target) => void | PromiseLike<void>) => {
			return testFunction(description, () => {
				return fn(this.targetWrapper.target); 
			});
		}
	}

	createIt() {
		const result = this.createSuiteCase(
			mochaIt as any, 
		) as MethodTestFunction<Target>;
		result.only = this.createSuiteCase(
			mochaIt.only as any, 
		) as MethodTestFunction<Target>;
		result.skip = this.createSuiteCase(
			mochaIt.skip as any, 
		) as MethodTestFunction<Target>;

		return result;
	}
}

export interface BaseInstanceTestFunction<Target> {
	(description: string, callback: (target: Target) => any);
}

export interface MethodTestFunction<Target> extends BaseInstanceTestFunction<Target> {
	only: BaseInstanceTestFunction<Target>;
	skip: BaseInstanceTestFunction<Target>;
}
