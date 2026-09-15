<script setup lang="ts">
import { computed } from "vue";
import type { InputTemplateProperties } from "@V/input";
import type { GridTemplateLayoutProps } from "../types";

type Props = (
	& InputTemplateProperties["props"]
	& GridTemplateLayoutProps
	& {
		hideEmptyMessageError?: boolean;
	}
);

const props = defineProps<Props>();

defineSlots<InputTemplateProperties["slots"]>();

const selfStyles = computed(() => ({
	"--DFV-grid-columns": props.columns,
}));
</script>

<template>
	<div
		class="DFV-grid-element DFV-grid-input"
		:style="selfStyles"
	>
		<label
			v-if="props.getLabel"
			:for="props.fieldKey"
		>
			{{ props.getLabel() }}
		</label>

		<slot name="input" />

		<small
			class="DFV-grid-error"
			v-if="
				props.getErrorMessage
					&& (
						props.getErrorMessage() !== null ||
						props.hideEmptyMessageError !== true
					)
			"
		>
			{{ props.getErrorMessage() }}
		</small>
	</div>
</template>
