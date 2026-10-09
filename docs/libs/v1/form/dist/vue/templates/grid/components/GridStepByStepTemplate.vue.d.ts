import { StepTemplateProperties } from '../../../layouts';
import { FunctionButtonComponent } from '../../../types';
export type Props = (StepTemplateProperties["props"] & {
    nextButton: FunctionButtonComponent;
    nextLabel?: string;
    previousButton: FunctionButtonComponent;
    previousLabel?: string;
    resetButton: FunctionButtonComponent;
    resetLabel?: string;
    hideEmptyMessageError?: boolean;
});
type __VLS_Slots = StepTemplateProperties["slots"];
declare const __VLS_base: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    nextStep: () => any;
    previousStep: () => any;
    resetStep: () => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onNextStep?: (() => any) | undefined;
    onPreviousStep?: (() => any) | undefined;
    onResetStep?: (() => any) | undefined;
}>, {
    nextLabel: string;
    previousLabel: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
