<script setup lang="ts">
import { IconChevronDown } from "./icons";

export interface Props {
	fieldKey?: string;
	options: {
		value: string;
		label: string;
	}[];
}

const props = withDefaults(
	defineProps<Props>(),
	{ fieldKey: "default" },
);

const modelValue = defineModel<string | null>({ default: null });
</script>

<template>
	<div class="DFV-select-input-root">
		<select
			class="DFV-select-input"
			v-model="modelValue"
			:id="`select-${props.fieldKey}`"
		>
			<option
				v-for="{value, label} of props.options"
				:value="value"
				:key="`${value}-${label}`"
			>
				{{ label }}
			</option>
		</select>

		<span class="DFV-select-input-icon">
			<IconChevronDown />
		</span>
	</div>
</template>

<style lang="scss">
.DFV-select-input-root {
	--DFV-select-input-width: 100%;
	--DFV-select-input-background: var(--DFV-color-white);
	--DFV-select-input-foreground: var(--DFV-muted-foreground);
	--DFV-select-input-border-color: var(--DFV-muted-border);
	--DFV-select-input-hover-border-color: var(--DFV-muted-border-strong);
	--DFV-select-input-focus-border-color: var(--DFV-primary);
	--DFV-select-input-focus: var(--DFV-primary-focus);
	--DFV-select-input-icon-color: var(--DFV-muted-foreground);
	--DFV-select-input-icon-size: 1rem;

	box-sizing: border-box;
	position: relative;
	width: var(--DFV-select-input-width);

	.DFV-select-input {
		box-sizing: border-box;
		width: 100%;
		min-height: 2.25rem;
		padding: var(--DFV-spacing-sm);
		padding-right: calc(var(--DFV-spacing-sm) * 2.8);
		border: 1px solid var(--DFV-select-input-border-color);
		border-radius: var(--DFV-radius-sm);
		background-color: var(--DFV-select-input-background);
		color: var(--DFV-select-input-foreground);
		font-size: var(--DFV-font-size-sm);
		font-weight: var(--DFV-font-weight-medium);
		line-height: var(--DFV-line-height-tight);
		appearance: none;
		transition:
			border-color var(--DFV-transition-fast),
			box-shadow var(--DFV-transition-fast),
			background-color var(--DFV-transition-fast);

		&:hover {
			border-color: var(--DFV-select-input-hover-border-color);
		}

		&:focus-visible {
			outline: none;
			border-color: var(--DFV-select-input-focus-border-color);
			box-shadow: 0 0 0 2px var(--DFV-select-input-focus);
		}
	}

	.DFV-select-input-icon {
		position: absolute;
		top: 50%;
		right: 0.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--DFV-select-input-icon-color);
		pointer-events: none;
		transform: translateY(-50%);

		.DFV-icon-svg {
			width: var(--DFV-select-input-icon-size);
			height: var(--DFV-select-input-icon-size);
		}
	}
}
</style>
