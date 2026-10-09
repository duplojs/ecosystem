import { Templates } from '../../template';
import { GridCheckTemplate, GridFormTemplate, GridInputTemplate, GridMultiTemplate, GridRepeatTemplate, GridSectionTemplate, GridStepByStepTemplate, GridUnionTemplate } from './components';
import { FormTemplateProperties } from '../../form';
import { InputTemplateProperties } from '../../input';
import { SectionTemplateProperties, CheckTemplateProperties, MultiTemplateProperties, RepeatTemplateProperties, StepTemplateProperties, UnionTemplateProperties } from '../../layouts';
import type * as DCommon from "@duplojs-v1/lang/common";
export type * from './types';
export * from './components';
export interface CreateGridTemplatesInput {
    form?: DCommon.SimplifyTopLevel<Omit<InstanceType<typeof GridFormTemplate>["$props"], keyof FormTemplateProperties["props"]>>;
    input?: DCommon.SimplifyTopLevel<Omit<InstanceType<typeof GridInputTemplate>["$props"], keyof InputTemplateProperties["props"]>>;
    multi?: DCommon.SimplifyTopLevel<Omit<InstanceType<typeof GridMultiTemplate>["$props"], keyof MultiTemplateProperties["props"]>>;
    check?: DCommon.SimplifyTopLevel<Omit<InstanceType<typeof GridCheckTemplate>["$props"], keyof CheckTemplateProperties["props"]>>;
    section?: DCommon.SimplifyTopLevel<Omit<InstanceType<typeof GridSectionTemplate>["$props"], keyof SectionTemplateProperties["props"]>>;
    repeat: DCommon.SimplifyTopLevel<Omit<InstanceType<typeof GridRepeatTemplate>["$props"], keyof RepeatTemplateProperties["props"]>>;
    step: DCommon.SimplifyTopLevel<Omit<InstanceType<typeof GridStepByStepTemplate>["$props"], keyof StepTemplateProperties["props"]>>;
    union: DCommon.SimplifyTopLevel<Omit<InstanceType<typeof GridUnionTemplate>["$props"], keyof UnionTemplateProperties["props"]>>;
}
export declare function createGridTemplates(params: CreateGridTemplatesInput): {
    useFormTemplate: import('../../template').UseTemplate<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly fieldKey: string;
            readonly getCurrentValue: () => unknown;
            readonly maxColumns?: number | undefined;
            readonly gap?: number | undefined;
            readonly onSubmit?: (() => any) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: (event: "submit") => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<import('./components/GridFormTemplate.vue').Props> & Readonly<{
            onSubmit?: (() => any) | undefined;
        }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            submit: () => any;
        }, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<import('./components/GridFormTemplate.vue').Props> & Readonly<{
        onSubmit?: (() => any) | undefined;
    }>, never> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            formField(): any;
            submitter(): any;
        };
    }, {
        fieldKey: string;
        getCurrentValue(): unknown;
    } & {
        onSubmit?: (() => any) | undefined;
    }>;
    useInputTemplate: import('../../template').UseTemplate<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly getLabel?: (() => string) | undefined;
            readonly getCurrentValue: () => unknown;
            readonly getErrorMessage?: (() => string | null) | undefined;
            readonly fieldKey: string;
            readonly columns?: number | undefined;
            readonly hideEmptyMessageError?: boolean | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: (event: string, ...args: any[]) => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<{
            getLabel?(): string;
            getCurrentValue(): unknown;
            getErrorMessage?(): string | null;
            fieldKey: string;
        } & import('./types').GridTemplateLayoutProps & {
            hideEmptyMessageError?: boolean;
        }> & Readonly<{}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<{
        getLabel?(): string;
        getCurrentValue(): unknown;
        getErrorMessage?(): string | null;
        fieldKey: string;
    } & import('./types').GridTemplateLayoutProps & {
        hideEmptyMessageError?: boolean;
    }> & Readonly<{}>, never> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            input(): any;
        };
    }, {
        getLabel?(): string;
        getCurrentValue(): unknown;
        getErrorMessage?(): string | null;
        fieldKey: string;
    }>;
    useMultiTemplate: import('../../template').UseTemplate<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly fieldKey: string;
            readonly getCurrentValue: () => unknown;
            readonly getFormFields: () => (import('vue').VNode | null)[];
            readonly maxColumns?: number | undefined;
            readonly gap?: number | undefined;
            readonly columns?: number | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: (event: string, ...args: any[]) => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<import('./components/GridMultiTemplate.vue').Props> & Readonly<{}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<import('./components/GridMultiTemplate.vue').Props> & Readonly<{}>, never> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            formField(): any;
        };
    }, {
        fieldKey: string;
        getCurrentValue(): unknown;
        getFormFields(): (import('vue').VNode | null)[];
    } & {
        fieldKey: string;
        getCurrentValue(): unknown;
        title?: string;
    }>;
    useCheckTemplate: import('../../template').UseTemplate<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly fieldKey: string;
            readonly getCurrentValue: () => unknown;
            readonly getErrorMessage: () => string | null;
            readonly maxColumns?: number | undefined;
            readonly gap?: number | undefined;
            readonly columns?: number | undefined;
            readonly hideEmptyMessageError?: boolean | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: (event: string, ...args: any[]) => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<import('./components/GridCheckTemplate.vue').Props> & Readonly<{}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<import('./components/GridCheckTemplate.vue').Props> & Readonly<{}>, never> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            formField(): any;
        };
    }, {
        fieldKey: string;
        getCurrentValue(): unknown;
        getErrorMessage(): string | null;
    } & {
        fieldKey: string;
        getCurrentValue(): unknown;
        title?: string;
    }>;
    useRepeatTemplate: import('../../template').UseTemplate<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly fieldKey: string;
            readonly max: number;
            readonly min: number;
            readonly getFormFieldsQuantity: () => number;
            readonly getCurrentValue: () => unknown;
            readonly getFormFields: () => (import('vue').VNode | null)[];
            readonly maxColumns?: number | undefined;
            readonly gap?: number | undefined;
            readonly columns?: number | undefined;
            readonly repeatElementColumn?: number | undefined;
            readonly repeatElementMaxColumn?: number | undefined;
            readonly removeButton: import('../..').FunctionButtonComponent;
            readonly removeLabel?: string | undefined;
            readonly addButton: import('../..').FunctionButtonComponent;
            readonly addLabel?: string | undefined;
            readonly resetButton: import('../..').FunctionButtonComponent;
            readonly resetLabel?: string | undefined;
            readonly onAddElement?: (() => any) | undefined;
            readonly onRemoveElement?: ((index: number) => any) | undefined;
            readonly onResetElement?: ((index: number) => any) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: ((event: "addElement") => void) & ((event: "removeElement", index: number) => void) & ((event: "resetElement", index: number) => void);
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<import('./components/GridRepeatTemplate.vue').Props> & Readonly<{
            onAddElement?: (() => any) | undefined;
            onRemoveElement?: ((index: number) => any) | undefined;
            onResetElement?: ((index: number) => any) | undefined;
        }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            addElement: () => any;
            removeElement: (index: number) => any;
            resetElement: (index: number) => any;
        }, string, {
            removeLabel: string;
            addLabel: string;
            resetLabel: string;
        }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{
        removeLabel: string;
        addLabel: string;
        resetLabel: string;
    }> & Omit<Readonly<import('./components/GridRepeatTemplate.vue').Props> & Readonly<{
        onAddElement?: (() => any) | undefined;
        onRemoveElement?: ((index: number) => any) | undefined;
        onResetElement?: ((index: number) => any) | undefined;
    }>, "removeLabel" | "addLabel" | "resetLabel"> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            formField(): any;
        };
    }, {
        fieldKey: string;
        max: number;
        min: number;
        getFormFieldsQuantity(): number;
        getCurrentValue(): unknown;
        getFormFields(): (import('vue').VNode | null)[];
    } & {
        onAddElement?: (() => any) | undefined;
        onRemoveElement?: ((index: number) => any) | undefined;
        onResetElement?: ((index: number) => any) | undefined;
    }>;
    useUnionTemplate: import('../../template').UseTemplate<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly fieldKey: string;
            readonly kinds: string[];
            readonly getCurrentValue: () => unknown;
            readonly getCurrentKind: () => string;
            readonly maxColumns?: number | undefined;
            readonly gap?: number | undefined;
            readonly columns?: number | undefined;
            readonly labels?: Record<string, string> | undefined;
            readonly selectInputKind: import('../..').FunctionSelectInputComponent;
            readonly onChangeKind?: ((kind: string) => any) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: (event: "changeKind", kind: string) => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<import('./components/GridUnionTemplate.vue').Props> & Readonly<{
            onChangeKind?: ((kind: string) => any) | undefined;
        }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            changeKind: (kind: string) => any;
        }, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<import('./components/GridUnionTemplate.vue').Props> & Readonly<{
        onChangeKind?: ((kind: string) => any) | undefined;
    }>, never> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            formField(): any;
        };
    }, {
        fieldKey: string;
        kinds: string[];
        getCurrentValue(): unknown;
        getCurrentKind(): string;
    } & {
        onChangeKind?: ((kind: string) => any) | undefined;
    }>;
    useStepByStepTemplate: import('../../template').UseTemplate<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly fieldKey: string;
            readonly stepQuantity: number;
            readonly isLastStep: () => boolean;
            readonly getFormFields: () => (() => (import('vue').VNode | null))[];
            readonly getCurrentValue: () => unknown;
            readonly getCurrentStep: () => number;
            readonly getErrorMessageNotAtLastStep: () => null | string;
            readonly nextButton: import('../..').FunctionButtonComponent;
            readonly nextLabel?: string | undefined;
            readonly previousButton: import('../..').FunctionButtonComponent;
            readonly previousLabel?: string | undefined;
            readonly resetButton: import('../..').FunctionButtonComponent;
            readonly resetLabel?: string | undefined;
            readonly hideEmptyMessageError?: boolean | undefined;
            readonly onNextStep?: (() => any) | undefined;
            readonly onPreviousStep?: (() => any) | undefined;
            readonly onResetStep?: (() => any) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: ((event: "nextStep") => void) & ((event: "previousStep") => void) & ((event: "resetStep") => void);
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<import('./components/GridStepByStepTemplate.vue').Props> & Readonly<{
            onNextStep?: (() => any) | undefined;
            onPreviousStep?: (() => any) | undefined;
            onResetStep?: (() => any) | undefined;
        }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            nextStep: () => any;
            previousStep: () => any;
            resetStep: () => any;
        }, string, {
            nextLabel: string;
            previousLabel: string;
        }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{
        nextLabel: string;
        previousLabel: string;
    }> & Omit<Readonly<import('./components/GridStepByStepTemplate.vue').Props> & Readonly<{
        onNextStep?: (() => any) | undefined;
        onPreviousStep?: (() => any) | undefined;
        onResetStep?: (() => any) | undefined;
    }>, "nextLabel" | "previousLabel"> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            formField(): any;
        };
    }, {
        fieldKey: string;
        stepQuantity: number;
        isLastStep(): boolean;
        getFormFields(): (() => (import('vue').VNode | null))[];
        getCurrentValue(): unknown;
        getCurrentStep(): number;
        getErrorMessageNotAtLastStep(): null | string;
    } & {
        onNextStep?: (() => any) | undefined;
        onPreviousStep?: (() => any) | undefined;
        onResetStep?: (() => any) | undefined;
    }>;
    useSectionTemplate: import('../../template').UseTemplate<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly fieldKey: string;
            readonly getCurrentValue: () => unknown;
            readonly title?: string | undefined;
            readonly maxColumns?: number | undefined;
            readonly gap?: number | undefined;
            readonly columns?: number | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: import('vue').Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: (event: string, ...args: any[]) => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<Readonly<{
            fieldKey: string;
            getCurrentValue(): unknown;
            title?: string;
        } & import('./types').GridTemplateLayoutContainerProps> & Readonly<{}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {}, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import('vue').nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<{
        fieldKey: string;
        getCurrentValue(): unknown;
        title?: string;
    } & import('./types').GridTemplateLayoutContainerProps> & Readonly<{}>, never> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: {
            formField(): any;
        };
    }, {
        fieldKey: string;
        getCurrentValue(): unknown;
        title?: string;
    }>;
    useTemplates: () => Templates;
};
