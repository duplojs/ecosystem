<script setup lang="ts">
import { PrimaryButton, OutlineButton, DestructiveButton } from "@duplojs/form/vueDesignSystem";
import { usePostModeration } from "./usePostModeration";

const { ModerationForm, selectedDecision, submitted, selectApproval, selectRejection, submit } = usePostModeration();
</script>

<template>
	<section>
		<h1>Moderate post</h1>

		<OutlineButton @click="selectApproval">
			Approve
		</OutlineButton>

		<DestructiveButton @click="selectRejection">
			Reject
		</DestructiveButton>

		<p>Selected decision: {{ selectedDecision }}</p>

		<ModerationForm @submit="submit">
			<PrimaryButton type="submit">
				Submit decision
			</PrimaryButton>
		</ModerationForm>

		<p v-if="submitted">
			{{ submitted }}
		</p>
	</section>
</template>
