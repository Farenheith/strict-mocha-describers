import { ClassOf } from './strict-describers';
export declare function getFakeInstance<Target, Class extends ClassOf<Target>>(cls: Class): Target;
export declare function fakeStaticClass<Target>(cls: Target): void;
