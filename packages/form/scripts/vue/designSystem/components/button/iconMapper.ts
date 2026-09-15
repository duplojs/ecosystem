import { defineAsyncComponent } from "vue";

export const iconMapper = {
	next: defineAsyncComponent(() => import("../icons/IconNext.vue")),
	previous: defineAsyncComponent(() => import("../icons/IconPrevious.vue")),
	plus: defineAsyncComponent(() => import("../icons/IconPlus.vue")),
	remove: defineAsyncComponent(() => import("../icons/IconRemove.vue")),
	reset: defineAsyncComponent(() => import("../icons/IconReset.vue")),
	minus: defineAsyncComponent(() => import("../icons/IconMinus.vue")),
};
