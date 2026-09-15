<script setup lang="ts">
export interface Props {
	placeholder?: string;
}

const props = defineProps<Props>();

const model = defineModel<string>();
</script>

<template>
	<input
		class="DFV-text-input"
		v-model="model"
		type="text"
		:placeholder="props.placeholder"
	/>
</template>

<style lang="scss">
.DFV-text-input {
	--DFV-text-input-width: 100%;
	--DFV-text-input-background: var(--DFV-color-white);
	--DFV-text-input-foreground: var(--DFV-muted-foreground);
	--DFV-text-input-border-color: var(--DFV-muted-border);
	--DFV-text-input-hover-border-color: var(--DFV-muted-border-strong);
	--DFV-text-input-focus-border-color: var(--DFV-primary);
	--DFV-text-input-focus: var(--DFV-primary-focus);
	--DFV-text-input-placeholder: var(--DFV-muted-foreground);

	box-sizing: border-box;
	width: var(--DFV-text-input-width);
	padding: var(--DFV-spacing-sm);
	border: 1px solid var(--DFV-text-input-border-color);
	border-radius: var(--DFV-radius-sm);
	background: var(--DFV-text-input-background);
	color: var(--DFV-text-input-foreground);
	font-size: var(--DFV-font-size-sm);
	font-weight: var(--DFV-font-weight-medium);
	line-height: var(--DFV-line-height-tight);
	transition:
		border-color var(--DFV-transition-fast),
		box-shadow var(--DFV-transition-fast),
		background-color var(--DFV-transition-fast);

	&::placeholder {
		color: var(--DFV-text-input-placeholder);
	}

	&:hover {
		border-color: var(--DFV-text-input-hover-border-color);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--DFV-text-input-focus-border-color);
		box-shadow: 0 0 0 2px var(--DFV-text-input-focus);
	}
}
</style>
