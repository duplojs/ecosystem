<script setup lang="ts">
import { computed, ref } from "vue";
import * as DInvocation from "@duplojs/lang/invocation";
import NumberInput from "../NumberInput.vue";

export interface Props {
	min?: number;
	max?: number;
	step?: number;
	manual?: boolean;
	manualDebounce?: number;
}

const props = withDefaults(
	defineProps<Props>(),
	{
		min: 0,
		max: 100,
		step: 1,
		manual: false,
		manualDebounce: 500,
	},
);

const model = defineModel<number>({ required: true });

const inputValue = ref(model.value);

const modelValue = computed({
	get: () => model.value,
	set: (newValue: number) => {
		const roundedValue = Math.round(newValue / props.step) * props.step;

		if (roundedValue > props.max || roundedValue < props.min) {
			inputValue.value = model.value;
			return;
		}

		model.value = roundedValue;
		inputValue.value = roundedValue;
	},
});

const updateByInputFlow = DInvocation.flow(
	DInvocation.debounce<number>(`${props.manualDebounce}ms`),
	(newValue: number) => {
		modelValue.value = newValue;
	},
);

function onUpdateInput(newValue: number) {
	inputValue.value = newValue;
	void updateByInputFlow(newValue);
}

const rangeStyle = computed(() => {
	const clampedValue = Math.min(Math.max(modelValue.value, props.min), props.max);

	return { "--DFV-range-progress-value": `${((clampedValue - props.min) / (props.max - props.min)) * 100}%` };
});

</script>

<template>
	<div class="DFV-range">
		<input
			class="DFV-range-input"
			v-model.number="modelValue"
			:style="rangeStyle"
			type="range"
			:min="props.min"
			:max="props.max"
			:step="props.step"
		/>

		<NumberInput
			v-if="manual"
			:model-value="inputValue"
			@update:model-value="onUpdateInput"
			:min="min"
			:max="max"
			:step="props.step"
		/>
	</div>
</template>

<style lang="scss">
.DFV-range {
	--DFV-range-track-color: var(--DFV-muted-border);
	--DFV-range-track-hover-color: var(--DFV-muted-border-strong);
	--DFV-range-track-active-color: var(--DFV-primary);
	--DFV-range-thumb-color: var(--DFV-primary);
	--DFV-range-thumb-border-color: var(--DFV-primary-border);
	--DFV-range-focus: var(--DFV-primary-focus);
	--DFV-range-track-height: 0.35rem;
	--DFV-range-thumb-size: 1rem;
	--DFV-range-progress: 0%;
	--DFV-range-manual-gap: var(--DFV-spacing-sm);
	--DFV-range-manual-width: 8rem;
	--DFV-range-manual-justify: start;

	display: grid;
	gap: var(--DFV-range-manual-gap);
	width: 100%;

	.DFV-range-input {
		width: 100%;
		height: 1.35rem;
		margin: 0;
		padding: 0;
		appearance: none;
		background: transparent;
		cursor: pointer;

		&:focus-visible {
			outline: none;
		}

		&::-webkit-slider-runnable-track {
			height: var(--DFV-range-track-height);
			border-radius: 999px;
			background: linear-gradient(
				to right,
				var(--DFV-range-track-active-color) 0,
				var(--DFV-range-track-active-color) var(--DFV-range-progress-value, var(--DFV-range-progress)),
				var(--DFV-range-track-color) var(--DFV-range-progress-value, var(--DFV-range-progress)),
				var(--DFV-range-track-color) 100%
			);
			transition: background-color var(--DFV-transition-fast);
		}

		&::-webkit-slider-thumb {
			appearance: none;
			width: var(--DFV-range-thumb-size);
			height: var(--DFV-range-thumb-size);
			margin-top: calc((var(--DFV-range-track-height) - var(--DFV-range-thumb-size)) / 2);
			border: 1px solid var(--DFV-range-thumb-border-color);
			border-radius: 999px;
			background: var(--DFV-range-thumb-color);
			transition:
				transform var(--DFV-transition-fast),
				box-shadow var(--DFV-transition-fast);
		}

		&:hover::-webkit-slider-runnable-track {
			background: linear-gradient(
				to right,
				var(--DFV-range-track-active-color) 0,
				var(--DFV-range-track-active-color) var(--DFV-range-progress-value, var(--DFV-range-progress)),
				var(--DFV-range-track-hover-color) var(--DFV-range-progress-value, var(--DFV-range-progress)),
				var(--DFV-range-track-hover-color) 100%
			);
		}

		&:hover::-webkit-slider-thumb {
			transform: scale(1.04);
		}

		&:focus-visible::-webkit-slider-thumb {
			box-shadow: 0 0 0 3px var(--DFV-range-focus);
		}

		&::-moz-range-track {
			height: var(--DFV-range-track-height);
			border: 0;
			border-radius: 999px;
			background: var(--DFV-range-track-color);
			transition: background-color var(--DFV-transition-fast);
		}

		&:hover::-moz-range-track {
			background: var(--DFV-range-track-hover-color);
		}

		&::-moz-range-progress {
			height: var(--DFV-range-track-height);
			border-radius: 999px;
			background: var(--DFV-range-track-active-color);
		}

		&::-moz-range-thumb {
			width: var(--DFV-range-thumb-size);
			height: var(--DFV-range-thumb-size);
			border: 1px solid var(--DFV-range-thumb-border-color);
			border-radius: 999px;
			background: var(--DFV-range-thumb-color);
			transition:
				transform var(--DFV-transition-fast),
				box-shadow var(--DFV-transition-fast);
		}

		&:hover::-moz-range-thumb {
			transform: scale(1.04);
		}

		&:focus-visible::-moz-range-thumb {
			box-shadow: 0 0 0 3px var(--DFV-range-focus);
		}
	}

	.DFV-number-input {
		width: var(--DFV-range-manual-width);
		justify-self: var(--DFV-range-manual-justify);
	}
}
</style>
