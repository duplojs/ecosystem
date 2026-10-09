import { AnyConstructor } from './types';
export declare function instanceOf<GenericInput extends unknown, GenericConstructor extends AnyConstructor>(valueConstructor: GenericConstructor | GenericConstructor[]): (input: GenericInput) => input is Extract<GenericInput, InstanceType<GenericConstructor>>;
export declare function instanceOf<GenericInput extends unknown, GenericConstructor extends AnyConstructor>(input: GenericInput, valueConstructor: GenericConstructor | GenericConstructor[]): input is Extract<GenericInput, InstanceType<GenericConstructor>>;
