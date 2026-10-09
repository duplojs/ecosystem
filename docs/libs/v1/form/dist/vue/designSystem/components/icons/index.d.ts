export { default as IconChevronDown } from './IconChevronDown.vue';
export { default as IconMinus } from './IconMinus.vue';
export { default as IconNext } from './IconNext.vue';
export { default as IconPlus } from './IconPlus.vue';
export { default as IconPrevious } from './IconPrevious.vue';
export { default as IconRemove } from './IconRemove.vue';
export { default as IconReset } from './IconReset.vue';
export declare const dfvIconSizeMapper: {
    readonly sm: "0.875rem";
    readonly md: "1rem";
    readonly lg: "1.125rem";
    readonly xl: "1.25rem";
    readonly "2xl": "1.5rem";
};
export type DfvIconSize = keyof typeof dfvIconSizeMapper;
export interface DfvIconProps {
    size?: DfvIconSize;
    strokeWidth?: number;
}
