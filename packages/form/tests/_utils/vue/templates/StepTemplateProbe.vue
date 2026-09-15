<script setup lang="ts">
import { computed } from "vue";
import { type StepTemplateProperties } from "@V/layouts";

type Props = (
	& StepTemplateProperties["props"]
);

const props = defineProps<Props>();

defineEmits<StepTemplateProperties["emits"]>();

defineSlots<StepTemplateProperties["slots"]>();

const firstFormField = computed(
	() => props.getFormFields()[0]?.() ?? null,
);
</script>

<template>
	<div>
		<small id="probe-step-current">{{ props.getCurrentStep() }}</small>

		<component :is="firstFormField" />

		<slot name="formField" />
	</div>
</template>
