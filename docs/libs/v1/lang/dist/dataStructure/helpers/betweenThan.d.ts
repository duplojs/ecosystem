import { BetweenThanConstraint } from '../constraint';
export declare function betweenThan<GenericGreater extends number, GenericLess extends number>(greater: GenericGreater, less: GenericLess): BetweenThanConstraint<GenericGreater, GenericLess>;
