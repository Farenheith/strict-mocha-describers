// tslint:disable-next-line: no-any
export type ClassOf<T> = (new (...params: any[]) => T) & {
	prototype: T;
	name: string;
};
