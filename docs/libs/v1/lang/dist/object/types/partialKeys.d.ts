import type * as DCommon from '../../common';
export type PartialKeys<GenericObject extends object, GenericKey extends keyof GenericObject = keyof GenericObject> = DCommon.SimplifyTopLevel<Omit<GenericObject, GenericKey> & Partial<Pick<GenericObject, GenericKey>>>;
