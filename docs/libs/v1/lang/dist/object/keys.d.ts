export declare function keys<GenericObject extends object>(object: GenericObject): readonly `${Exclude<keyof GenericObject, symbol>}`[];
