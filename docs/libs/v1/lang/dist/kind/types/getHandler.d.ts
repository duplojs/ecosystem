import { Definition, Handler, KeySymbol, Kind } from '../base';
export type GetHandler<GenericObject extends Kind<any>> = {
    [Prop in keyof GenericObject[KeySymbol]]: Prop extends string ? Handler<Definition<Prop, GenericObject[KeySymbol][Prop]>> : never;
}[keyof GenericObject[KeySymbol]];
