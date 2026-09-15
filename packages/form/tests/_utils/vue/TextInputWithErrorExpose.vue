<script setup lang="ts">
import * as DEither from "@duplojs/lang/either";

interface Props {
	id?: string;
}

defineProps<Props>();

const model = defineModel<string>();

defineExpose({
	check: () => DEither.error([{ key: "inner-field" }]),
});
</script>

<template>
	<input
		id="test-text-input"
		v-model="model"
	/>
</template>
