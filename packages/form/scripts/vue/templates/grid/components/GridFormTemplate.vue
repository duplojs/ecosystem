<script setup lang="ts">
import { computed } from "vue";
import type { FormTemplateProperties } from "@V/form";
import type { GridTemplateContainerProps } from "../types";

export type Props = (
	& FormTemplateProperties["props"]
	& GridTemplateContainerProps
);

const props = defineProps<Props>();

defineSlots<FormTemplateProperties["slots"]>();

const emit = defineEmits<FormTemplateProperties["emits"]>();

function submit(event: SubmitEvent) {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
	emit("submit");
}

const containerStyles = computed(() => ({
	"--DFV-grid-max-columns": props.maxColumns,
	"--DFV-grid-gap": props.gap !== undefined ? `${props.gap}px` : undefined,
}));
</script>

<template>
	<form
		@submit="submit"
		class="DFV-grid-form"
	>
		<div
			class="DFV-grid-container"
			:style="containerStyles"
		>
			<slot name="formField" />
		</div>

		<slot name="submitter" />
	</form>
</template>
