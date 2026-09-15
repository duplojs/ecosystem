<script setup lang="ts">
import { type SectionTemplateProperties } from "@V/layouts";

type Props = (
	& SectionTemplateProperties["props"]
);

defineProps<Props>();

defineSlots<SectionTemplateProperties["slots"]>();
</script>

<template>
	<div>
		<slot name="formField" />
	</div>
</template>
