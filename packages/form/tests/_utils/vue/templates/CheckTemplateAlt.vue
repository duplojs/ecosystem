<script setup lang="ts">
import { type CheckTemplateProperties } from "@V/layouts";

type Props = (
	& CheckTemplateProperties["props"]
);

const props = defineProps<Props>();

defineSlots<CheckTemplateProperties["slots"]>();
</script>

<template>
	<section id="local-check-template">
		<header id="local-check-field-key">
			{{ props.fieldKey }}
		</header>

		<slot name="formField" />

		<footer id="local-check-error-message">
			{{ props.getErrorMessage() }}
		</footer>
	</section>
</template>
