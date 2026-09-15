<script setup lang="ts">
import type * as DChrono from "@duplojs/lang/chrono";
import { IconMinus } from "../icons";
import TimeInput from "./TimeInput.vue";

export interface Props {
	min?: DChrono.TheTime | DChrono.SerializedTheTime;
	max?: DChrono.TheTime | DChrono.SerializedTheTime;
}

const props = defineProps<Props>();

export interface Model {
	to: DChrono.TheTime | DChrono.SerializedTheTime | null;
	from: DChrono.TheTime | DChrono.SerializedTheTime | null;
}

const model = defineModel<Model>({
	default: () => ({
		from: null,
		to: null,
	}),
});
</script>

<template>
	<div class="DFV-range-time-input">
		<TimeInput
			v-model="model.from"
			:min="props.min"
			:max="model.to ?? props.max"
		/>

		<span class="DFV-range-time-input-separator">
			<IconMinus />
		</span>

		<TimeInput
			v-model="model.to"
			:min="model.from ?? props.min"
			:max="props.max"
		/>
	</div>
</template>

<style lang="scss">
.DFV-range-time-input {
	--DFV-range-time-input-gap: var(--DFV-spacing-sm);
	--DFV-range-time-input-separator-color: var(--DFV-muted-foreground);

	display: grid;
	grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
	align-items: center;
	gap: var(--DFV-range-time-input-gap);

	.DFV-range-time-input-separator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--DFV-range-time-input-separator-color);
		line-height: 1;
	}
}
</style>
