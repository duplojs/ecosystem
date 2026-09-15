<script setup lang="ts">
import { computed } from "vue";
import { dfvIconSizeMapper, type DfvIconProps } from "./index";

const props = withDefaults(
	defineProps<DfvIconProps>(),
	{
		size: "md",
		strokeWidth: 1.7,
	},
);

const iconStyle = computed(() => ({
	"--DFV-icon-size": dfvIconSizeMapper[props.size],
}));
</script>

<template>
	<svg
		class="DFV-icon-svg"
		data-dfv-icon="remove"
		:style="iconStyle"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M5 5L15 15"
			stroke="currentColor"
			:stroke-width="strokeWidth"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>

		<path
			d="M15 5L5 15"
			stroke="currentColor"
			:stroke-width="strokeWidth"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</template>
