import type * as DCommon from '../../common';
export type Assign<GenericFirstObject extends object, GenericSecondObject extends object> = DCommon.SimplifyTopLevel<Omit<GenericFirstObject, keyof GenericSecondObject> & GenericSecondObject>;
