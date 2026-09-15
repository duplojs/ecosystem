<script setup lang="ts">
import { type SectionTemplateProperties } from "@V/layouts";

type Props = (
	& SectionTemplateProperties["props"]
);

const props = defineProps<Props>();

defineSlots<SectionTemplateProperties["slots"]>();
</script>

<template>
	<section id="local-section-template">
		<small id="local-section-title">{{ props.title ?? "" }}</small>

		<slot name="formField" />

		<div id="local-section-current-value">
			{{ props.getCurrentValue() }}
		</div>
	</section>
</template>
