import type * as DCommon from '../common';
type TransformObject<GenericObjectInput extends object = object> = {
    [Prop in keyof GenericObjectInput]?: (input: GenericObjectInput[Prop]) => unknown;
};
type TransformPropertiesOutput<GenericObjectInput extends object, GenericTransformObject extends TransformObject<GenericObjectInput>> = DCommon.SimplifyTopLevel<Omit<GenericObjectInput, keyof GenericTransformObject> & {
    [Prop in keyof GenericTransformObject]: (ReturnType<Extract<GenericTransformObject[Prop], DCommon.AnyFunction>> | (undefined extends GenericTransformObject[Prop] ? GenericObjectInput[Extract<Prop, keyof GenericObjectInput>] : never));
}>;
export declare function transformProperties<GenericObjectInput extends object, GenericTransformObject extends TransformObject<NoInfer<GenericObjectInput>>>(transformObject: TransformObject<NoInfer<GenericObjectInput>> & GenericTransformObject): (object: GenericObjectInput) => TransformPropertiesOutput<NoInfer<GenericObjectInput>, NoInfer<GenericTransformObject>>;
export declare function transformProperties<GenericObjectInput extends object, GenericTransformObject extends TransformObject<GenericObjectInput>>(object: GenericObjectInput, transformObject: DCommon.FixDeepFunctionInfer<TransformObject<GenericObjectInput>, GenericTransformObject>): TransformPropertiesOutput<GenericObjectInput, GenericTransformObject>;
export {};
