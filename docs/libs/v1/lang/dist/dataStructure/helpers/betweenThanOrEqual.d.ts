import { BetweenThanOrEqualConstraint } from '../constraint';
export declare function betweenThanOrEqual<GenericGreater extends number, GenericLess extends number>(greater: GenericGreater, less: GenericLess): BetweenThanOrEqualConstraint<GenericGreater, GenericLess>;
