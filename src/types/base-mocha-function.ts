export interface BaseMochaFunction<
	B extends Function,
	C extends Function
> extends Function {
	skip: B;
	only: C;
}
