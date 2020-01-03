import { BaseInstanceTestFunction } from "./base-instance-test-function";
export interface MethodTestFunction<Target> extends BaseInstanceTestFunction<Target> {
	only: BaseInstanceTestFunction<Target>;
	skip: BaseInstanceTestFunction<Target>;
}
