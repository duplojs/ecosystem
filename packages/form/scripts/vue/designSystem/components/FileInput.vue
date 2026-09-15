<script setup lang="ts">
export interface Props {
	accept?: string;
	multiple?: boolean;
}

const props = withDefaults(
	defineProps<Props>(),
	{
		multiple: false,
	},
);

const model = defineModel<File[] | null>();

function handleChange(event: Event) {
	const target = event.target as HTMLInputElement;
	const files = target.files;

	if (!files || files.length === 0) {
		model.value = undefined;
		return;
	}

	model.value = Array.from(files);
}
</script>

<template>
	<input
		class="DFV-file-input"
		type="file"
		:accept="props.accept"
		:multiple="props.multiple"
		@change="handleChange"
	/>
</template>

<style lang="scss">
.DFV-file-input {
	--DFV-file-input-width: 100%;
	--DFV-file-input-background: var(--DFV-color-white);
	--DFV-file-input-foreground: var(--DFV-muted-foreground);
	--DFV-file-input-border-color: var(--DFV-muted-border);
	--DFV-file-input-hover-border-color: var(--DFV-muted-border-strong);
	--DFV-file-input-focus-border-color: var(--DFV-primary);
	--DFV-file-input-focus: var(--DFV-primary-focus);
	--DFV-file-input-button-background: var(--DFV-muted);
	--DFV-file-input-button-border-color: var(--DFV-muted-border);
	--DFV-file-input-button-hover-background: var(--DFV-muted-hover);
	--DFV-file-input-button-foreground: var(--DFV-muted-foreground);

	box-sizing: border-box;
	width: var(--DFV-file-input-width);
	padding: calc(var(--DFV-spacing-sm) * 0.5);
	border: 1px solid var(--DFV-file-input-border-color);
	border-radius: var(--DFV-radius-sm);
	background: var(--DFV-file-input-background);
	color: var(--DFV-file-input-foreground);
	font-size: var(--DFV-font-size-sm);
	font-weight: var(--DFV-font-weight-medium);
	line-height: var(--DFV-line-height-tight);
	transition:
		border-color var(--DFV-transition-fast),
		box-shadow var(--DFV-transition-fast),
		background-color var(--DFV-transition-fast);

	&:hover {
		border-color: var(--DFV-file-input-hover-border-color);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--DFV-file-input-focus-border-color);
		box-shadow: 0 0 0 2px var(--DFV-file-input-focus);
	}

	&::file-selector-button {
		margin-right: 0.65rem;
		padding: calc(var(--DFV-spacing-sm) * 0.75) var(--DFV-spacing-sm);
		border: 1px solid var(--DFV-file-input-button-border-color);
		border-radius: calc(var(--DFV-radius-sm) - 2px);
		background: var(--DFV-file-input-button-background);
		color: var(--DFV-file-input-button-foreground);
		font-size: var(--DFV-font-size-sm);
		font-weight: var(--DFV-font-weight-medium);
		line-height: var(--DFV-line-height-tight);
		cursor: pointer;
		transition:
			background-color var(--DFV-transition-fast),
			border-color var(--DFV-transition-fast);
	}

	&:hover::file-selector-button {
		background: var(--DFV-file-input-button-hover-background);
		border-color: var(--DFV-file-input-hover-border-color);
	}
}
</style>
