import { testUtils } from './test-utils';
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
		return testUtils.setupFunction(this.createSuiteCase.bind(this), mochaIt) as MethodTestFunction<Target>;
	}
}


