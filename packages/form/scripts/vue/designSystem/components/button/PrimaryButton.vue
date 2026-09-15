<script setup lang="ts">
import TheButton, { type Props as TheButtonProps } from "./TheButton.vue";

export type Props = Pick<
	TheButtonProps,
	"label" | "size" | "icon" | "iconPosition" | "iconSize" | "type" | "disabled"
>;

const props = defineProps<Props>();

</script>

<template>
	<TheButton
		variant="primary"
		v-bind="props"
	/>
</template>
