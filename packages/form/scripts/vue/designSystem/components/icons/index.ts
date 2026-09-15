export { default as IconChevronDown } from "./IconChevronDown.vue";
export { default as IconMinus } from "./IconMinus.vue";
export { default as IconNext } from "./IconNext.vue";
export { default as IconPlus } from "./IconPlus.vue";
export { default as IconPrevious } from "./IconPrevious.vue";
export { default as IconRemove } from "./IconRemove.vue";
export { default as IconReset } from "./IconReset.vue";

export const dfvIconSizeMapper = {
	sm: "0.875rem",
	md: "1rem",
	lg: "1.125rem",
	xl: "1.25rem",
	"2xl": "1.5rem",
} as const;

export type DfvIconSize = keyof typeof dfvIconSizeMapper;

export interface DfvIconProps {
	size?: DfvIconSize;
	strokeWidth?: number;
}
