<script setup lang="ts">
import * as DChrono from "@duplojs/lang/chrono";
import * as DEither from "@duplojs/lang/either";
import { computed } from "vue";

export interface Props {
	min?: DChrono.TheDate | DChrono.SerializedTheDate;
	max?: DChrono.TheDate | DChrono.SerializedTheDate;
}

const props = defineProps<Props>();

const model = defineModel<DChrono.TheDate | DChrono.SerializedTheDate | null>();

const modelValue = computed({
	get: () => model.value
		? DChrono.formatDate(model.value, "YYYY-MM-DD", "UTC")
		: model.value,
	set: (value) => {
		const result = DChrono.createDate(new Date(value ?? NaN));

		if (DEither.isRight(result)) {
			model.value = DEither.unwrapRight(result);
		} else {
			model.value = null;
		}
	},
});

const rangeDate = computed(
	() => ({
		min: props.min && DChrono.formatDate(props.min, "YYYY-MM-DD", "UTC"),
		max: props.max && DChrono.formatDate(props.max, "YYYY-MM-DD", "UTC"),
	}),
);
</script>

<template>
	<input
		class="DFV-date-input"
		v-model="modelValue"
		type="date"
		:min="rangeDate.min"
		:max="rangeDate.max"
	/>
</template>

<style lang="scss">
.DFV-date-input {
	--DFV-date-input-width: 100%;
	--DFV-date-input-background: var(--DFV-color-white);
	--DFV-date-input-foreground: var(--DFV-muted-foreground);
	--DFV-date-input-border-color: var(--DFV-muted-border);
	--DFV-date-input-hover-border-color: var(--DFV-muted-border-strong);
	--DFV-date-input-focus-border-color: var(--DFV-primary);
	--DFV-date-input-focus: var(--DFV-primary-focus);

	box-sizing: border-box;
	width: var(--DFV-date-input-width);
	padding: var(--DFV-spacing-sm);
	border: 1px solid var(--DFV-date-input-border-color);
	border-radius: var(--DFV-radius-sm);
	background: var(--DFV-date-input-background);
	color: var(--DFV-date-input-foreground);
	font-size: var(--DFV-font-size-sm);
	font-weight: var(--DFV-font-weight-medium);
	line-height: var(--DFV-line-height-tight);
	transition:
		border-color var(--DFV-transition-fast),
		box-shadow var(--DFV-transition-fast),
		background-color var(--DFV-transition-fast);

	&:hover {
		border-color: var(--DFV-date-input-hover-border-color);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--DFV-date-input-focus-border-color);
		box-shadow: 0 0 0 2px var(--DFV-date-input-focus);
	}
}
</style>
