<script setup lang="ts">
import type { StepTemplateProperties } from "@V/layouts";
import type { FunctionButtonComponent } from "@V/types";

export type Props = (
	& StepTemplateProperties["props"]
	& {
		nextButton: FunctionButtonComponent;
		nextLabel?: string;
		previousButton: FunctionButtonComponent;
		previousLabel?: string;
		resetButton: FunctionButtonComponent;
		resetLabel?: string;
		hideEmptyMessageError?: boolean;
	}
);

const props = withDefaults(
	defineProps<Props>(),
	{
		nextLabel: "Next",
		previousLabel: "Previous",
	},
);

const emit = defineEmits<StepTemplateProperties["emits"]>();

defineSlots<StepTemplateProperties["slots"]>();
</script>

<template>
	<div class="DFV-grid-element DFV-step-root">
		<div class="DFV-step-content">
			<slot name="formField" />
		</div>

		<small
			class="DFV-step-error"
			v-if="props.getErrorMessageNotAtLastStep() || props.hideEmptyMessageError !== true"
		>
			{{ props.getErrorMessageNotAtLastStep() }}
		</small>

		<div class="DFV-step-actions">
			<component
				:is="props.previousButton"
				:label="props.previousLabel"
				:disabled="props.getCurrentStep() === 0"
				@click="emit('previousStep')"
			/>

			<component
				:is="props.resetButton"
				:label="props.resetLabel"
				@click="emit('resetStep')"
			/>

			<component
				:is="props.nextButton"
				:label="props.nextLabel"
				:disabled="props.isLastStep()"
				@click="emit('nextStep')"
			/>
		</div>
	</div>
</template>
