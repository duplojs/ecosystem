<script setup lang="ts">
import { type UnionTemplateProperties } from "@V/layouts";

type Props = (
	& UnionTemplateProperties["props"]
);

const props = defineProps<Props>();

const emit = defineEmits<UnionTemplateProperties["emits"]>();

defineSlots<UnionTemplateProperties["slots"]>();
</script>

<template>
	<section id="local-union-template">
		<header id="local-union-kind">{{ props.getCurrentKind() }}</header>

		<small id="local-union-value">{{ JSON.stringify(props.getCurrentValue()) }}</small>

		<button
			id="local-union-invalid-kind"
			@click="emit('changeKind', 'invalid')"
		>
			invalid
		</button>

		<button
			id="local-union-kind-b"
			@click="emit('changeKind', 'b')"
		>
			b
		</button>

		<slot name="formField" />
	</section>
</template>
