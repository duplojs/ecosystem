<script setup lang="ts">
import { computed } from "vue";
import type { SectionTemplateProperties } from "@V/layouts";
import type { GridTemplateLayoutContainerProps } from "../types";

type Props = (
	& SectionTemplateProperties["props"]
	& GridTemplateLayoutContainerProps
);

const props = defineProps<Props>();

defineSlots<SectionTemplateProperties["slots"]>();

const selfStyles = computed(() => ({
	"--DFV-grid-columns": props.columns,
}));

const containerStyles = computed(() => ({
	"--DFV-grid-max-columns": props.maxColumns,
	"--DFV-grid-gap": props.gap !== undefined ? `${props.gap}px` : undefined,
}));
</script>

<template>
	<div
		class="DFV-grid-element"
		:style="selfStyles"
	>
		<label
			v-if="props.title"
			:for="props.fieldKey"
		>
			{{ props.title }}
		</label>

		<div
			class="DFV-grid-container"
			:style="containerStyles"
		>
			<slot name="formField" />
		</div>
	</div>
</template>
