<script setup lang="ts">
import { type CheckTemplateProperties } from "@V/layouts";

export type Props = (
	& CheckTemplateProperties["props"]
);

const props = defineProps<Props>();

defineSlots<CheckTemplateProperties["slots"]>();

</script>

<template>
	<div>
		<small id="check-field-key">{{ props.fieldKey }}</small>

		<slot name="formField" />

		<small id="check-current-value">
			{{ props.getCurrentValue() }}
		</small>

		<small id="check-error-message">
			{{ props.getErrorMessage() }}
		</small>
	</div>
</template>
