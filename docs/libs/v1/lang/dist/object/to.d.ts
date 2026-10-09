import type * as DCommon from '../common';
type ShapeObject<GenericInput extends unknown = unknown> = {
    [Prop in string]?: (input: GenericInput) => unknown;
};
type ToOutput<GenericShapeObject extends ShapeObject<any>> = DCommon.SimplifyTopLevel<{
    [Prop in keyof GenericShapeObject]: (ReturnType<Extract<GenericShapeObject[Prop], DCommon.AnyFunction>> | (undefined extends GenericShapeObject[Prop] ? undefined : never));
}>;
export declare function to<GenericInput extends unknown, GenericShapeObject extends ShapeObject<NoInfer<GenericInput>>>(shapeObject: ShapeObject<NoInfer<GenericInput>> & GenericShapeObject): (input: GenericInput) => ToOutput<NoInfer<GenericShapeObject>>;
export declare function to<GenericInput extends unknown, GenericShapeObject extends ShapeObject<GenericInput>>(input: GenericInput, shapeObject: DCommon.FixDeepFunctionInfer<ShapeObject<GenericInput>, GenericShapeObject>): ToOutput<GenericShapeObject>;
export {};
