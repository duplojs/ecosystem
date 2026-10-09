import { Assign } from './types';
import type * as DCommon from '../common';
export declare function assign<GenericObject extends object, GenericValue extends Partial<Record<keyof GenericObject, unknown>> & DCommon.AnyObject>(value: GenericValue): (object: GenericObject) => Assign<GenericObject, GenericValue>;
export declare function assign<GenericObject extends object, GenericValue extends Partial<Record<keyof GenericObject, unknown>> & DCommon.AnyObject>(object: GenericObject, value: GenericValue): Assign<GenericObject, GenericValue>;
