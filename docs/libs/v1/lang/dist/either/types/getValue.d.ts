import { valueKind } from '../kind';
import type * as DKind from '../../kind';
export type GetValue<GenericEither extends DKind.Kind<typeof valueKind>> = DKind.GetValue<typeof valueKind, GenericEither>;
