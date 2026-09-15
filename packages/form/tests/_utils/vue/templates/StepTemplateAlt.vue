<script setup lang="ts">
import { type StepTemplateProperties } from "@V/layouts";

type Props = (
	& StepTemplateProperties["props"]
);

const props = defineProps<Props>();

const emit = defineEmits<StepTemplateProperties["emits"]>();

defineSlots<StepTemplateProperties["slots"]>();
</script>

<template>
	<section id="local-step-template">
		<header id="local-step-current">{{ props.getCurrentStep() }}</header>

		<small id="local-step-error">{{ props.getErrorMessageNotAtLastStep() }}</small>

		<button
			id="local-step-next"
			@click="emit('nextStep')"
		>
			next
		</button>

		<slot name="formField" />
	</section>
</template>
