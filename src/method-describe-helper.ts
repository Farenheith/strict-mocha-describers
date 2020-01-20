import { beforeEach, afterEach } from 'mocha';
import { MethodTestFunction } from "./types/method-test-function";
import { testUtils } from "./test-utils";
import { ClassOf } from "./types/class-of";
import { MethodSuite } from "./types/method-suite";
import { ItHelper } from "./it-helper";
import { StaticMethodDescribeHelper } from "./static-method-describe-helper";

export class MethodDescribeHelper<Target, Class extends ClassOf<Target>> extends StaticMethodDescribeHelper<Class> {
	constructor(
		protected readonly bootstrap: () => Target,
		cls: Class
	) {
		super(cls);
	}

	private createMethodDescribe = (suite: (title: string, fn: () => void) => void) => {
		const result = ((method: keyof Target,
			fn: (
					it: MethodTestFunction<Target>,
					getTarget: () => Target,
				) => void
		) => {
			const itHelper = new ItHelper(this.cls, this.bootstrap, method);
			const it = itHelper.createIt();

			suite(`Method ${method}`, () => {
				beforeEach(itHelper.beforeEach);

				fn(it, () => itHelper.target);

				afterEach(itHelper.afterEach);
			});
		}) as MethodSuite<Target, Class>;
		result.static = this.createStaticDescribe();
		return result;
	}

	createDescribe() {
		return testUtils.setupFunction(this.createMethodDescribe, describe) as MethodSuite<Target, Class>;
	}
}


