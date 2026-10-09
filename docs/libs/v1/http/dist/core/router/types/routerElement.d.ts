import { BodyReader } from '../../request';
import { BuildedRoute } from '../../route/types';
export interface RouterElement {
    readonly pattern: RegExp;
    readonly matchedPath: string;
    readonly bodyReader: BodyReader;
    readonly buildedRoute: BuildedRoute;
}
