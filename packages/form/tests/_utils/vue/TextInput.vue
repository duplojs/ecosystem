<script setup lang="ts">
interface Props {
	id?: string;
}

defineProps<Props>();

const model = defineModel<string>();

</script>

<template>
	<input
		id="test-text-input"
		v-model="model"
	/>
</template>
