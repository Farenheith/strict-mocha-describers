import { it as mochaIt } from "mocha";
import { MethodTestFunction } from "./types/method-test-function";

export interface TestWrapper<Target> {
	target: Target;
}

export class ItHelper<Target> {
	constructor(private readonly targetWrapper: TestWrapper<Target>) { }

	createSuiteCase(testFunction: Function) {
		return (description: string, fn: (target: Target) => void | PromiseLike<void>) => {
			return testFunction(description, () => {
				return fn(this.targetWrapper.target);
			});
		}
	}

	createIt() {
		const result = this.createSuiteCase(mochaIt) as MethodTestFunction<Target>;
		result.only = this.createSuiteCase(mochaIt.only);
		result.skip = this.createSuiteCase(mochaIt.skip);

		return result;
	}
}


