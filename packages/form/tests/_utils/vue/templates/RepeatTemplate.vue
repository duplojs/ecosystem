<script setup lang="ts">
import { type RepeatTemplateProperties } from "@V/layouts";

export type Props = (
	& RepeatTemplateProperties["props"]
);

const props = withDefaults(
	defineProps<Props>(),
	{
	},
);

const emit = defineEmits<RepeatTemplateProperties["emits"]>();

defineSlots<RepeatTemplateProperties["slots"]>();
</script>

<template>
	<div>
		<small id="repeat-field-key">{{ props.fieldKey }}</small>

		<small id="repeat-current-value">{{ JSON.stringify(props.getCurrentValue()) }}</small>

		<small id="repeat-form-fields-count">{{ props.getFormFields().length }}</small>

		<small id="repeat-min">{{ props.min }}</small>

		<small id="repeat-max">{{ props.max }}</small>

		<div
			class="DFV-grid-element"
			v-for="(formField, index) in props.getFormFields()"
			:key="index"
		>
			<button
				:id="`repeat-reset-${index}`"
				@click="emit('resetElement', index)"
			>
				reset {{ index }}
			</button>

			<button
				:id="`repeat-remove-${index}`"
				@click="emit('removeElement', index)"
			>
				remove {{ index }}
			</button>

			<component :is="formField" />
		</div>

		<button
			id="repeat-add"
			@click="emit('addElement')"
		>
			add
		</button>
	</div>
</template>
