<script setup lang="ts">
import { type UnionTemplateProperties } from "@V/layouts";
import { computed } from "vue";

export type Props = (
	& UnionTemplateProperties["props"]
);

const props = withDefaults(
	defineProps<Props>(),
	{
	},
);

const emit = defineEmits<UnionTemplateProperties["emits"]>();

defineSlots<UnionTemplateProperties["slots"]>();

const modelValue = computed({
	get: () => props.getCurrentKind(),
	set: (value) => {
		emit("changeKind", value);
	},
});
</script>

<template>
	<div>
		<small id="union-field-key">{{ props.fieldKey }}</small>

		<small id="union-current-value">{{ JSON.stringify(props.getCurrentValue()) }}</small>

		<small id="union-current-kind">{{ props.getCurrentKind() }}</small>

		<select
			id="union-kind-select"
			v-model="modelValue"
		>
			<option
				v-for="kind in props.kinds"
				:value="kind"
				:key="kind"
			>
				{{ kind }}
			</option>
		</select>

		<slot name="formField" />
	</div>
</template>
