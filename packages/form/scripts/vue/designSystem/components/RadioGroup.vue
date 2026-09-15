<script setup lang="ts">
export interface Props {
	name?: string;
	options: {
		value: string;
		label: string;
		description?: string;
	}[];
}

const props = defineProps<Props>();

const model = defineModel<string | null>();
</script>

<template>
	<div
		class="DFV-radio-group"
		role="radiogroup"
	>
		<label
			v-for="(option, index) of props.options"
			:key="option.value"
			class="DFV-radio"
		>
			<input
				class="DFV-radio-input"
				v-model="model"
				type="radio"
				:id="`${props.name}-${index}`"
				:name="props.name"
				:value="option.value"
			/>

			<span class="DFV-radio-content">
				<span class="DFV-radio-label">
					{{ option.label }}
				</span>

				<small
					v-if="option.description"
					class="DFV-radio-description"
				>
					{{ option.description }}
				</small>
			</span>
		</label>
	</div>
</template>

<style lang="scss">
.DFV-radio-group {
	--DFV-radio-group-gap: var(--DFV-spacing-sm);

	display: flex;
	flex-direction: column;
	gap: var(--DFV-radio-group-gap);
}

.DFV-radio {
	--DFV-radio-background: var(--DFV-color-white);
	--DFV-radio-border-color: var(--DFV-muted-border-strong);
	--DFV-radio-hover-border-color: var(--DFV-muted-border-stronger);
	--DFV-radio-checked-background: var(--DFV-primary);
	--DFV-radio-checked-border-color: var(--DFV-primary-border);
	--DFV-radio-indicator: var(--DFV-primary-foreground);
	--DFV-radio-focus: var(--DFV-primary-focus);
	--DFV-radio-label-color: var(--DFV-muted-foreground);
	--DFV-radio-description-color: var(--DFV-muted-foreground-soft);
	--DFV-radio-content-gap: 0.15rem;

	display: inline-flex;
	align-items: center;
	gap: var(--DFV-spacing-sm);
	cursor: pointer;

	.DFV-radio-input {
		appearance: none;
		width: 1rem;
		height: 1rem;
		margin: 0;
		border: 1px solid var(--DFV-radio-border-color);
		border-radius: 999px;
		background: var(--DFV-radio-background);
		display: inline-grid;
		place-content: center;
		transition:
			background-color var(--DFV-transition-fast),
			border-color var(--DFV-transition-fast),
			box-shadow var(--DFV-transition-fast);

		&::after {
			content: "";
			width: 0.45rem;
			height: 0.45rem;
			border-radius: 999px;
			transform: scale(0);
			transition: transform var(--DFV-transition-fast);
			background: var(--DFV-radio-indicator);
		}

		&:hover {
			border-color: var(--DFV-radio-hover-border-color);
		}

		&:focus-visible {
			outline: none;
			box-shadow: 0 0 0 2px var(--DFV-radio-focus);
		}

		&:checked {
			background: var(--DFV-radio-checked-background);
			border-color: var(--DFV-radio-checked-border-color);
		}

		&:checked::after {
			transform: scale(1);
		}
	}

	.DFV-radio-content {
		display: flex;
		flex-direction: column;
		gap: var(--DFV-radio-content-gap);
	}

	.DFV-radio-label {
		font-size: var(--DFV-font-size-sm);
		line-height: var(--DFV-line-height-tight);
		font-weight: var(--DFV-font-weight-medium);
		color: var(--DFV-radio-label-color);
	}

	.DFV-radio-description {
		font-size: var(--DFV-font-size-sm);
		line-height: var(--DFV-line-height-tight);
		color: var(--DFV-radio-description-color);
	}
}
</style>
