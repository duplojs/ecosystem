<script setup lang="ts">
defineProps<{
	hint: string;
	placeholder?: string;
}>();
const model = defineModel<string>({ required: true });
</script>

<template>
	<div>
		<input
			v-model="model"
			:placeholder="placeholder"
			type="email"
		/>

		<small>{{ hint }}</small>
	</div>
</template>
