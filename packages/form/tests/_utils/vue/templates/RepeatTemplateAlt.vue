<script setup lang="ts">
import { type RepeatTemplateProperties } from "@V/layouts";

type Props = (
	& RepeatTemplateProperties["props"]
);

const props = defineProps<Props>();

const emit = defineEmits<RepeatTemplateProperties["emits"]>();

defineSlots<RepeatTemplateProperties["slots"]>();
</script>

<template>
	<section id="local-repeat-template">
		<header id="local-repeat-field-key">
			{{ props.fieldKey }}
		</header>

		<small id="local-repeat-current-value">{{ JSON.stringify(props.getCurrentValue()) }}</small>

		<button
			id="local-repeat-add"
			@click="emit('addElement')"
		>
			add
		</button>

		<button
			id="local-repeat-reset-invalid"
			@click="emit('resetElement', 999)"
		>
			reset invalid
		</button>

		<slot name="formField" />
	</section>
</template>
