import { AnyFunction } from './types';
import type * as DObject from '../object';
export declare function detachObjectMethod<GenericObject extends object, GenericMethod extends keyof GenericObject>(object: GenericObject, method: GenericMethod & DObject.GetPropsWithValueExtends<GenericObject, AnyFunction>): GenericObject[GenericMethod];
