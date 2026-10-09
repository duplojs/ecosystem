import { BodyReader } from '../../request';
import { BuildedRoute } from '../../route/types';
export interface RouterElementSystem {
    readonly bodyReader: BodyReader;
    readonly buildedRoute: BuildedRoute;
}
