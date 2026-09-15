<script setup lang="ts">
interface Props {
	text: string;
}

defineProps<Props>();

const model = defineModel<string>();
</script>

<template>
	<input
		class="duplo-text-input"
		v-model="model"
		type="text"
	/>
</template>

<style lang="scss" scoped>
.duplo-text-input {
	--input-bg: #ffffff;
	--input-fg: #1f2937;
	--input-border: #cbd5e1;
	--input-hover-border: #94a3b8;
	--input-focus-border: #d4ac24;
	--input-focus-shadow: #f2dc92;

	padding: 0.5rem 0.75rem;
	border: 1px solid var(--input-border);
	border-radius: 0.5rem;
	background: var(--input-bg);
	color: var(--input-fg);
	font-size: 0.875rem;
	font-weight: 500;
	line-height: 1.2;
	transition:
		border-color 140ms ease,
		box-shadow 140ms ease,
		background-color 140ms ease;

	&::placeholder {
		color: #94a3b8;
	}

	&:hover {
		border-color: var(--input-hover-border);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--input-focus-border);
		box-shadow: 0 0 0 2px var(--input-focus-shadow);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
}
</style>
