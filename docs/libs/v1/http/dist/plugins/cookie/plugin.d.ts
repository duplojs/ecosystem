import { HubPlugin } from '../../core/hub';
import { Parser } from './parser';
import { Serializer } from './serialize';
export interface CookiePluginParams {
    parser?: Parser;
    serializer?: Serializer;
}
export declare function cookiePlugin(params?: CookiePluginParams): () => HubPlugin;
