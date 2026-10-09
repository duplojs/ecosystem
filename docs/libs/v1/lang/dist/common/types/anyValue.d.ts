import { AnyFunction } from './anyFunction';
export type AnyValue = string | number | boolean | object | null | bigint | AnyFunction | undefined | symbol | AnyValue[];
