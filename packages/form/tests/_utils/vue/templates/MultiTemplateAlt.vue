<script setup lang="ts">
import { type MultiTemplateProperties } from "@V/layouts";

type Props = (
	& MultiTemplateProperties["props"]
);

const props = defineProps<Props>();

defineSlots<MultiTemplateProperties["slots"]>();
</script>

<template>
	<section id="local-multi-template">
		<header id="local-multi-field-key">
			{{ props.fieldKey }}
		</header>

		<small id="local-multi-current-value">{{ JSON.stringify(props.getCurrentValue()) }}</small>

		<slot name="formField" />
	</section>
</template>
