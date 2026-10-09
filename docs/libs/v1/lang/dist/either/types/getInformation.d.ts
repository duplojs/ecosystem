import { informationKind } from '../kind';
import type * as DKind from '../../kind';
export type GetInformation<GenericEither extends DKind.Kind<typeof informationKind>> = DKind.GetValue<typeof informationKind, GenericEither>;
