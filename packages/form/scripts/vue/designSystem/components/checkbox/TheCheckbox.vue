<script setup lang="ts">
export interface Props {
	id: string;
	name?: string;
	label?: string;
}

defineProps<Props>();

const model = defineModel<boolean>({ default: false });
</script>

<template>
	<label
		class="DFV-checkbox"
	>
		<input
			class="DFV-checkbox-input"
			v-model="model"
			type="checkbox"
			:id="id"
			:name="name"
		/>

		<span
			v-if="label"
			class="DFV-checkbox-label"
		>
			{{ label }}
		</span>
	</label>
</template>
