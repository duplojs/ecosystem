import { ClassValue, VNode } from 'vue';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DObject from "@duplojs-v1/lang/object";
import type * as DKind from "@duplojs-v1/lang/kind";
export declare const templateKind: DKind.Handler<DKind.Definition<"@DuplojsVueForm/template", unknown>>;
type AllowedTemplateComponentInstances = InstanceType<AllowedTemplateComponents[keyof AllowedTemplateComponents]>;
export type CreateTemplateParams<GenericInputComponentInstance extends AllowedTemplateComponentInstances = AllowedTemplateComponentInstances, GenericTemplateSystemProps extends object = object> = DCommon.SimplifyTopLevel<(DCommon.SimplifyTopLevel<Omit<GenericInputComponentInstance["$props"], keyof GenericTemplateSystemProps>> extends infer InferredProps ? {} extends InferredProps ? {
    props?: InferredProps;
} : {
    props: InferredProps;
} : never)>;
export interface Template<GenericComponentInstance extends AllowedTemplateComponentInstances = AllowedTemplateComponentInstances> extends DKind.Kind<typeof templateKind> {
    getVNode(props: DCommon.SimplifyTopLevel<GenericComponentInstance["$props"] & {
        fieldKey: string;
        class?: ClassValue;
    } & {
        [key: string]: unknown;
    }>, slots: GenericComponentInstance["$slots"]): VNode;
}
export type UseTemplate<GenericComponentInstance extends AllowedTemplateComponentInstances = AllowedTemplateComponentInstances, GenericTemplateSystemProps extends object = object> = (params?: Partial<CreateTemplateParams<GenericComponentInstance, GenericTemplateSystemProps>["props"]>) => Template<GenericComponentInstance>;
export type GetTemplateComponentSystemProp<GenericComponent extends AllowedTemplateComponents[keyof AllowedTemplateComponents]> = DObject.UnionObjectToIntersection<{
    [Prop in keyof AllowedTemplateComponents]: GenericComponent extends AllowedTemplateComponents[Prop] ? InstanceType<AllowedTemplateComponents[Prop]>["$props"] : never;
}[keyof AllowedTemplateComponents]>;
export declare function createTemplate<GenericTemplate extends keyof AllowedTemplateComponents, GenericComponent extends AllowedTemplateComponents[GenericTemplate], GenericComponentInstance extends InstanceType<GenericComponent>>(template: GenericTemplate, templateComponent: GenericComponent, ...args: CreateTemplateParams<GenericComponentInstance, GetTemplateComponentSystemProp<GenericComponent>> extends infer InferredParams ? {} extends InferredParams ? [params?: InferredParams] : [params: InferredParams] : never): UseTemplate<GenericComponentInstance, GetTemplateComponentSystemProp<GenericComponent>>;
export type Templates = {
    [Prop in keyof AllowedTemplateComponents]: Template<InstanceType<AllowedTemplateComponents[Prop]>>;
};
export {};
