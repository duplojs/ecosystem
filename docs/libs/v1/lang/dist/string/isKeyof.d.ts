import type * as DCommon from '../common';
export declare function isKeyof<GenericObject extends object, GenericKey extends DCommon.ObjectKey>(object: GenericObject): (key: GenericKey) => key is keyof GenericObject & GenericKey;
export declare function isKeyof<GenericObject extends object, GenericKey extends DCommon.ObjectKey>(key: GenericKey, object: GenericObject): key is keyof GenericObject & GenericKey;
