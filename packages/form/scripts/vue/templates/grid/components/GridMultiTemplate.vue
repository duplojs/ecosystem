<script setup lang="ts">
import { computed } from "vue";
import type { MultiTemplateProperties } from "@V/layouts";
import type { GridTemplateLayoutContainerProps } from "../types";

export type Props = (
	& MultiTemplateProperties["props"]
	& GridTemplateLayoutContainerProps
);

const props = withDefaults(
	defineProps<Props>(),
	{
	},
);

defineSlots<MultiTemplateProperties["slots"]>();

const containerStyles = computed(() => ({
	"--DFV-grid-max-columns": props.maxColumns,
	"--DFV-grid-gap": props.gap !== undefined ? `${props.gap}px` : undefined,
	"--DFV-grid-columns": props.columns,
}));
</script>

<template>
	<div
		class="DFV-grid-container DFV-grid-element"
		:style="containerStyles"
	>
		<slot name="formField" />
	</div>
</template>
