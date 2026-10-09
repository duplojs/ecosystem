import { AnyAbstractConstructor } from './anyConstructor';
import { ComputedTypeError } from './computedTypeError';
export type RequireConstructor<GenericInput extends unknown, GenericConstructor extends AnyAbstractConstructor = AnyAbstractConstructor> = GenericInput extends GenericConstructor ? GenericInput : ComputedTypeError<"Require constructor.">;
