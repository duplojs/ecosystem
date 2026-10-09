import { ButtonHTMLAttributes } from 'vue';
import { DfvIconSize } from '../icons';
import { iconMapper } from './iconMapper';
export type Icon = keyof typeof iconMapper;
export type Size = "sm" | "md" | "lg" | "xl" | "2xl";
export type Variant = "destructive" | "primary" | "ghost" | "outline";
export type IconPosition = "start" | "end";
export interface Props {
    label?: string;
    variant?: Variant;
    size?: Size;
    icon?: Icon;
    iconSize?: DfvIconSize;
    iconPosition?: IconPosition;
    type?: ButtonHTMLAttributes["type"];
    disabled?: boolean;
}
declare const __VLS_export: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{}>, {
    size: Size;
    type: "submit" | "reset" | "button";
    disabled: boolean;
    variant: Variant;
    iconPosition: IconPosition;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
