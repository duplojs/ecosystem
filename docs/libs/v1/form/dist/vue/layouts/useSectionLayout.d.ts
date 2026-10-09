import { GetFormFieldSlots, FormField, GetFormFieldCheckedValue, GetFormFieldValue } from '../formField';
import { Templates } from '../template';
import { VueComponent } from '../types';
export interface SectionTemplateProperties {
    props: {
        fieldKey: string;
        getCurrentValue(): unknown;
        title?: string;
    };
    slots: {
        formField(): any;
    };
}
declare module '../template' {
    interface AllowedTemplateComponents {
        section: VueComponent<SectionTemplateProperties>;
    }
}
export interface UseSectionLayoutParams {
    title?: string;
    class?: string;
    template?: Templates["section"];
}
export declare function useSectionLayout<GenericFormField extends FormField>(formField: GenericFormField, params?: UseSectionLayoutParams): FormField<GetFormFieldValue<GenericFormField>, GetFormFieldCheckedValue<GenericFormField>, GetFormFieldSlots<GenericFormField>>;
