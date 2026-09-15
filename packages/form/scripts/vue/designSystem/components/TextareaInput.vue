<script setup lang="ts">
export interface Props {
	placeholder?: string;
}

const props = defineProps<Props>();

const model = defineModel<string>();
</script>

<template>
	<textarea
		class="DFV-text-area"
		v-model="model"
		:placeholder="props.placeholder"
	/>
</template>

<style lang="scss">
.DFV-text-area {
	--DFV-text-area-width: 100%;
	--DFV-text-area-background: var(--DFV-color-white);
	--DFV-text-area-foreground: var(--DFV-muted-foreground);
	--DFV-text-area-border-color: var(--DFV-muted-border);
	--DFV-text-area-hover-border-color: var(--DFV-muted-border-strong);
	--DFV-text-area-focus-border-color: var(--DFV-primary);
	--DFV-text-area-focus: var(--DFV-primary-focus);
	--DFV-text-area-placeholder: var(--DFV-muted-foreground);

	min-height: 6rem;
	box-sizing: border-box;
	width: var(--DFV-text-area-width);
	padding: var(--DFV-spacing-sm);
	border: 1px solid var(--DFV-text-area-border-color);
	border-radius: var(--DFV-radius-sm);
	background: var(--DFV-text-area-background);
	color: var(--DFV-text-area-foreground);
	font-size: var(--DFV-font-size-sm);
	font-weight: var(--DFV-font-weight-medium);
	line-height: var(--DFV-line-height-normal);
	resize: vertical;
	transition:
		border-color var(--DFV-transition-fast),
		box-shadow var(--DFV-transition-fast),
		background-color var(--DFV-transition-fast);

	&::placeholder {
		color: var(--DFV-text-area-placeholder);
	}

	&:hover {
		border-color: var(--DFV-text-area-hover-border-color);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--DFV-text-area-focus-border-color);
		box-shadow: 0 0 0 2px var(--DFV-text-area-focus);
	}
}
</style>
