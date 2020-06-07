export interface BaseMochaFunction<B extends Function> extends Function {
  skip: B;
  only: B;
}

export type BaseMochaType<A extends Function> = A & BaseMochaFunction<A>;
