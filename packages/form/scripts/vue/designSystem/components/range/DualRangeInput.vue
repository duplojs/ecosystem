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

export interface Model {
	start: number;
	end: number;
}

const model = defineModel<Model>({ required: true });

function roundValueToStep(value: number) {
	return Math.round(value / props.step) * props.step;
}

const startInputValue = ref(model.value.start);
const startModelValue = computed({
	get: () => model.value.start,
	set: (newValue: number) => {
		const roundedValue = roundValueToStep(newValue);

		if (roundedValue > model.value.end || roundedValue < props.min) {
			model.value = {
				...model.value,
			};
			startInputValue.value = model.value.start;
			return;
		}

		model.value = {
			...model.value,
			start: roundedValue,
		};
		startInputValue.value = roundedValue;
	},
});

const endInputValue = ref(model.value.end);
const endModelValue = computed({
	get: () => model.value.end,
	set: (newValue: number) => {
		const roundedValue = roundValueToStep(newValue);

		if (roundedValue < model.value.start || roundedValue > props.max) {
			model.value = {
				...model.value,
			};
			endInputValue.value = model.value.end;
			return;
		}

		model.value = {
			...model.value,
			end: roundedValue,
		};
		endInputValue.value = roundedValue;
	},
});

const updateStartByInputFlow = DInvocation.flow(
	DInvocation.debounce<number>(`${props.manualDebounce}ms`),
	(newValue: number) => {
		startModelValue.value = newValue;
	},
);

const updateEndByInputFlow = DInvocation.flow(
	DInvocation.debounce<number>(`${props.manualDebounce}ms`),
	(newValue: number) => {
		endModelValue.value = newValue;
	},
);

function updateStartByInput(newValue: number) {
	startInputValue.value = newValue;
	void updateStartByInputFlow(newValue);
}

function updateEndByInput(newValue: number) {
	endInputValue.value = newValue;
	void updateEndByInputFlow(newValue);
}

const rangeStyle = computed(() => {
	const startPercent = ((model.value.start - props.min) / (props.max - props.min)) * 100;
	const endPercent = ((model.value.end - props.min) / (props.max - props.min)) * 100;

	return {
		"--DFV-dual-range-start": `${startPercent}%`,
		"--DFV-dual-range-width": `${Math.max(endPercent - startPercent, 0)}%`,
	};
});

</script>

<template>
	<div class="DFV-dual-range">
		<div class="DFV-dual-range-container">
			<div class="DFV-dual-range-track" />

			<div
				class="DFV-dual-range-range"
				:style="rangeStyle"
			/>

			<input
				class="DFV-dual-range-input DFV-dual-range-input-start"
				v-model.number="startModelValue"
				type="range"
				:min="min"
				:max="max"
				:step="props.step"
			/>

			<input
				class="DFV-dual-range-input DFV-dual-range-input-end"
				v-model.number="endModelValue"
				type="range"
				:min="min"
				:max="max"
				:step="props.step"
			/>
		</div>

		<div
			v-if="manual"
			class="DFV-dual-range-container-input"
		>
			<NumberInput
				:model-value="startInputValue"
				@update:model-value="updateStartByInput"
				:min="min"
				:max="endModelValue"
				:step="props.step"
			/>

			<NumberInput
				:model-value="endInputValue"
				@update:model-value="updateEndByInput"
				:min="startModelValue"
				:max="max"
				:step="props.step"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.DFV-dual-range {
	--DFV-dual-range-track-color: var(--DFV-muted-border);
	--DFV-dual-range-track-hover-color: var(--DFV-muted-border-strong);
	--DFV-dual-range-track-active-color: var(--DFV-primary);
	--DFV-dual-range-thumb-color: var(--DFV-primary);
	--DFV-dual-range-thumb-border-color: var(--DFV-primary-border);
	--DFV-dual-range-focus: var(--DFV-primary-focus);
	--DFV-dual-range-track-height: 0.35rem;
	--DFV-dual-range-thumb-size: 1rem;
	--DFV-dual-range-start: 0%;
	--DFV-dual-range-width: 100%;
	--DFV-dual-range-gap: var(--DFV-spacing-sm);
	--DFV-dual-range-manual-width: 8rem;
	--DFV-dual-range-manual-justify: start;

	display: grid;
	gap: var(--DFV-dual-range-gap);
	width: 100%;

	.DFV-dual-range-container {
		position: relative;
		width: 100%;
		height: 1.35rem;
	}

	.DFV-dual-range-track,
	.DFV-dual-range-range {
		position: absolute;
		top: 50%;
		height: var(--DFV-dual-range-track-height);
		border-radius: 999px;
		transform: translateY(-50%);
	}

	.DFV-dual-range-track {
		right: 0;
		left: 0;
		background: var(--DFV-dual-range-track-color);
	}

	.DFV-dual-range-range {
		left: var(--DFV-dual-range-start);
		width: var(--DFV-dual-range-width);
		background: var(--DFV-dual-range-track-active-color);
	}

	.DFV-dual-range-input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 1.35rem;
		margin: 0;
		padding: 0;
		appearance: none;
		background: transparent;
		pointer-events: none;
		cursor: pointer;

		&:focus-visible {
			outline: none;
		}

		&::-webkit-slider-runnable-track {
			height: var(--DFV-dual-range-track-height);
			background: transparent;
		}

		&::-webkit-slider-thumb {
			appearance: none;
			pointer-events: auto;
			width: var(--DFV-dual-range-thumb-size);
			height: var(--DFV-dual-range-thumb-size);
			margin-top: calc((var(--DFV-dual-range-track-height) - var(--DFV-dual-range-thumb-size)) / 2);
			border: 1px solid var(--DFV-dual-range-thumb-border-color);
			border-radius: 999px;
			background: var(--DFV-dual-range-thumb-color);
			transition:
				transform var(--DFV-transition-fast),
				box-shadow var(--DFV-transition-fast);
		}

		&:hover::-webkit-slider-thumb {
			transform: scale(1.04);
		}

		&:focus-visible::-webkit-slider-thumb {
			box-shadow: 0 0 0 3px var(--DFV-dual-range-focus);
		}

		&::-moz-range-track {
			height: var(--DFV-dual-range-track-height);
			border: 0;
			background: transparent;
		}

		&::-moz-range-progress {
			height: var(--DFV-dual-range-track-height);
			background: transparent;
		}

		&::-moz-range-thumb {
			pointer-events: auto;
			width: var(--DFV-dual-range-thumb-size);
			height: var(--DFV-dual-range-thumb-size);
			border: 1px solid var(--DFV-dual-range-thumb-border-color);
			border-radius: 999px;
			background: var(--DFV-dual-range-thumb-color);
			transition:
				transform var(--DFV-transition-fast),
				box-shadow var(--DFV-transition-fast);
		}

		&:hover::-moz-range-thumb {
			transform: scale(1.04);
		}

		&:focus-visible::-moz-range-thumb {
			box-shadow: 0 0 0 3px var(--DFV-dual-range-focus);
		}
	}

	.DFV-dual-range-input-start {
		z-index: 2;
	}

	.DFV-dual-range-input-end {
		z-index: 3;
	}

	.DFV-dual-range-container-input {
		display: flex;
		justify-content: space-between;
	}

	.DFV-dual-range-container:hover .DFV-dual-range-track {
		background: var(--DFV-dual-range-track-hover-color);
	}

	.DFV-dual-range-container-input .DFV-number-input {
		width: var(--DFV-dual-range-manual-width);
	}
}
</style>
