<script setup lang="ts">
import * as DChrono from "@duplojs/lang/chrono";
import * as DEither from "@duplojs/lang/either";
import { computed } from "vue";

export interface Props {
	min?: DChrono.TheTime | DChrono.SerializedTheTime;
	max?: DChrono.TheTime | DChrono.SerializedTheTime;
}

const props = defineProps<Props>();

const model = defineModel<DChrono.TheTime | DChrono.SerializedTheTime | null>();

const modelValue = computed({
	get: () => model.value
		? DChrono.formatTime(model.value, "HH:mm")
		: model.value,
	set: (value) => {
		const result = DChrono.createTime({ value: value ?? "" });

		if (DEither.isRight(result)) {
			model.value = DEither.unwrapRight(result);
		} else {
			model.value = null;
		}
	},
});

const rangeDate = computed(
	() => ({
		min: props.min && DChrono.formatTime(props.min, "HH:mm"),
		max: props.max && DChrono.formatTime(props.max, "HH:mm"),
	}),
);
</script>

<template>
	<input
		class="DFV-time-input"
		v-model="modelValue"
		type="time"
		:min="rangeDate.min"
		:max="rangeDate.max"
	/>
</template>

<style lang="scss">
.DFV-time-input {
	--DFV-time-input-width: 100%;
	--DFV-time-input-background: var(--DFV-color-white);
	--DFV-time-input-foreground: var(--DFV-muted-foreground);
	--DFV-time-input-border-color: var(--DFV-muted-border);
	--DFV-time-input-hover-border-color: var(--DFV-muted-border-strong);
	--DFV-time-input-focus-border-color: var(--DFV-primary);
	--DFV-time-input-focus: var(--DFV-primary-focus);

	box-sizing: border-box;
	width: var(--DFV-time-input-width);
	padding: var(--DFV-spacing-sm);
	border: 1px solid var(--DFV-time-input-border-color);
	border-radius: var(--DFV-radius-sm);
	background: var(--DFV-time-input-background);
	color: var(--DFV-time-input-foreground);
	font-size: var(--DFV-font-size-sm);
	font-weight: var(--DFV-font-weight-medium);
	line-height: var(--DFV-line-height-tight);
	transition:
		border-color var(--DFV-transition-fast),
		box-shadow var(--DFV-transition-fast),
		background-color var(--DFV-transition-fast);

	&:hover {
		border-color: var(--DFV-time-input-hover-border-color);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--DFV-time-input-focus-border-color);
		box-shadow: 0 0 0 2px var(--DFV-time-input-focus);
	}
}
</style>
