<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";
import type { DfvIconSize } from "../icons";
import { iconMapper } from "./iconMapper";

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

withDefaults(
	defineProps<Props>(),
	{
		size: "md",
		variant: "primary",
		iconPosition: "start",
		disabled: false,
		type: "button",
	},
);

</script>

<template>
	<button
		:class="[
			'DFV-button',
			`DFV-button-variant-${variant}`,
			`DFV-button-size-${size}`,
		]"
		:type="type"
		:disabled="disabled"
	>
		<component
			v-if="icon && iconPosition === 'start'"
			:is="iconMapper[icon]"
			:size="iconSize ?? size"
		/>

		<span v-if="label">{{ label }}</span>

		<component
			v-if="icon && iconPosition === 'end'"
			:is="iconMapper[icon]"
			:size="iconSize ?? size"
		/>
	</button>
</template>
