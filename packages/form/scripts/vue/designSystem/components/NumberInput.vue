<script setup lang="ts">
export interface Props {
	placeholder?: string;
	min?: number;
	max?: number;
	step?: number;
}

const props = defineProps<Props>();

const model = defineModel<number>({ required: true });

function onInput(event: InputEvent) {
	const input = event.target as HTMLInputElement;

	if (input.value !== "") {
		model.value = Number(input.value);
		input.value = model.value.toString();
	} else {
		model.value = props.min ?? 0;
		input.value = props.min?.toString() ?? "0";
	}
}
</script>

<template>
	<input
		class="DFV-number-input"
		type="number"
		@input="onInput"
		:value="model"
		:placeholder="props.placeholder"
		:min="props.min"
		:max="props.max"
		:step="props.step"
	/>
</template>

<style lang="scss">
.DFV-number-input {
	--DFV-number-input-width: 100%;
	--DFV-number-input-background: var(--DFV-color-white);
	--DFV-number-input-foreground: var(--DFV-muted-foreground);
	--DFV-number-input-border-color: var(--DFV-muted-border);
	--DFV-number-input-hover-border-color: var(--DFV-muted-border-strong);
	--DFV-number-input-focus-border-color: var(--DFV-primary);
	--DFV-number-input-focus: var(--DFV-primary-focus);
	--DFV-number-input-placeholder: var(--DFV-muted-foreground);

	box-sizing: border-box;
	width: var(--DFV-number-input-width);
	padding: var(--DFV-spacing-sm);
	border: 1px solid var(--DFV-number-input-border-color);
	border-radius: var(--DFV-radius-sm);
	background: var(--DFV-number-input-background);
	color: var(--DFV-number-input-foreground);
	font-size: var(--DFV-font-size-sm);
	font-weight: var(--DFV-font-weight-medium);
	line-height: var(--DFV-line-height-tight);
	transition:
		border-color var(--DFV-transition-fast),
		box-shadow var(--DFV-transition-fast),
		background-color var(--DFV-transition-fast);

	&::placeholder {
		color: var(--DFV-number-input-placeholder);
	}

	&:hover {
		border-color: var(--DFV-number-input-hover-border-color);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--DFV-number-input-focus-border-color);
		box-shadow: 0 0 0 2px var(--DFV-number-input-focus);
	}
}
</style>
