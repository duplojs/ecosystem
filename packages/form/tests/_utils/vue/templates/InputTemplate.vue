<script setup lang="ts">
import { type InputTemplateProperties } from "@V/input";

type Props = (
	& InputTemplateProperties["props"]
);

const props = defineProps<Props>();

defineSlots<InputTemplateProperties["slots"]>();
</script>

<template>
	<div>
		<slot name="input" />

		<small id="current-value-input">{{ props.getCurrentValue() }}</small>

		<small id="input-error-message">
			{{ props.getErrorMessage?.() }}
		</small>
	</div>
</template>
