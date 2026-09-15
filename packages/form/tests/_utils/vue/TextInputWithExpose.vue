<script setup lang="ts">
import * as DEither from "@duplojs/lang/either";
import { type ExposeInputProperties } from "@V/input";
import { ref, useTemplateRef } from "vue";

interface Props {
	id?: string;
}

defineProps<Props>();

const model = defineModel<string>();
const isDisposed = ref(false);
const inputElement = useTemplateRef("inputElement");

defineExpose<ExposeInputProperties>({
	check: () => DEither.success("test"),
	reset: () => {
		setTimeout(
			() => {
				model.value = "reset";
			},
		);
	},
	dispose: () => {
		if (inputElement.value) {
			isDisposed.value = true;
		}

		model.value = "dispose";
	},
});

</script>

<template>
	<input
		id="test-text-input"
		ref="inputElement"
		v-model="model"
	/>

	<small
		v-if="isDisposed"
		id="text-input-with-expose-disposed"
	>
		disposed
	</small>
</template>
