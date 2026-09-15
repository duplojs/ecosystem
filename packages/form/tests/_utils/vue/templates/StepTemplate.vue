<script setup lang="ts">
import { type StepTemplateProperties } from "@V/layouts";

export type Props = (
	& StepTemplateProperties["props"]
);

const props = withDefaults(
	defineProps<Props>(),
	{
	},
);

const emit = defineEmits<StepTemplateProperties["emits"]>();

defineSlots<StepTemplateProperties["slots"]>();
</script>

<template>
	<div>
		<label id="step-current">
			{{ props.getCurrentStep() }}/{{ props.stepQuantity }}
		</label>

		<small id="step-is-last">{{ props.isLastStep() }}</small>

		<small id="step-current-value">{{ JSON.stringify(props.getCurrentValue()) }}</small>

		<small id="step-form-fields-count">{{ props.getFormFields().length }}</small>

		<slot name="formField" />

		<small id="step-error-message">{{ props.getErrorMessageNotAtLastStep() }}</small>

		<button
			id="step-previous"
			@click="emit('previousStep')"
		>
			previous
		</button>

		<button
			id="step-reset"
			@click="emit('resetStep')"
		>
			reset
		</button>

		<button
			id="step-next"
			@click="emit('nextStep')"
		>
			next
		</button>
	</div>
</template>
