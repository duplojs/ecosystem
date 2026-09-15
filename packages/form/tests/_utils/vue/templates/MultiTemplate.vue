<script setup lang="ts">
import { type MultiTemplateProperties } from "@V/layouts";

export type Props = (
	& MultiTemplateProperties["props"]
);

const props = withDefaults(
	defineProps<Props>(),
	{
	},
);

defineSlots<MultiTemplateProperties["slots"]>();
</script>

<template>
	<div>
		<small id="multi-field-key">{{ props.fieldKey }}</small>

		<small id="multi-current-value">{{ JSON.stringify(props.getCurrentValue()) }}</small>

		<small id="multi-form-fields-count">{{ props.getFormFields().length }}</small>

		<slot name="formField" />
	</div>
</template>
