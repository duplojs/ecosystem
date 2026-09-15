<script setup lang="ts">
import { createInput, useDisabledLayout, createForm, useMultiLayout, useCheckLayout, useRepeatLayout, useUnionLayout, useStepLayout, useSectionLayout, useSlotLayout } from "@V";
import { createGridTemplates } from "@V/templates/grid";
import { TheCheckbox, DateInput, FileInput, NumberInput, RadioGroup, RangeInput, PrimaryButton, TextareaInput, TextInput, TimeInput, DualRangeInput, CheckboxPolicy, RangeDateInput, RangeTimeInput, templateFormRemoveButton, templateFormResetButton, templateFormNextButton, templateFormPreviousButton, templateFormSelect, templateFormAddButton } from "@V/designSystem";
import { ref } from "vue";
import { C, DS } from "@duplojs/lang";

const gridTemplates = createGridTemplates({
	repeat: {
		addLabel: "Add another item",
		removeLabel: "Remove this item",
		addButton: templateFormAddButton,
		removeButton: templateFormRemoveButton,
		resetButton: templateFormResetButton,
	},
	step: {
		nextLabel: "Continue",
		previousLabel: "Back",
		resetButton: templateFormResetButton,
		nextButton: templateFormNextButton,
		previousButton: templateFormPreviousButton,
	},
	union: { selectInputKind: templateFormSelect },
});

const useTextInput = createInput(
	TextInput,
	{
		defaultValue: () => "Default value",
	},
);

const useNumberInput = createInput(
	NumberInput,
	{
		defaultValue: () => 42,
	},
);

const useTextArea = createInput(
	TextareaInput,
	{
		defaultValue: () => "Default value",
	},
);

const useCheckbox = createInput(
	TheCheckbox,
	{
		defaultValue: () => false,
		props: {
			name: "newsletter",
		},
	},
);

const useCheckboxPolicy = createInput(
	CheckboxPolicy,
	{
		defaultValue: () => false,
		props: {
			title: "I accept the terms",
			description: "Required to continue the process.",
			name: "policy",
			required: true,
		},
	},
);

const useRadioGroup = createInput(
	RadioGroup,
	{
		defaultValue: () => "weekly",
		props: {
			name: "frequency",
			options: [
				{
					value: "daily",
					label: "Daily updates",
					description: "Immediate notifications",
				},
				{
					value: "weekly",
					label: "Weekly digest",
					description: "One summary per week",
				},
				{
					value: "never",
					label: "No notifications",
					description: "Only essential account emails",
				},
			],
		},
	},
);

const useRangeInput = createInput(
	RangeInput,
	{
		defaultValue: () => 35,
		props: {
			min: 0,
			max: 100,
			step: 5,
			manual: true,
		},
	},
);

const useDateInput = createInput(
	DateInput,
	{
		defaultValue: () => C.now(),
		props: {
			min: C.createDate("1900-01-01"),
			max: C.createDate("2100-12-31"),
		},
	},
);

const useRangeDateInput = createInput(
	RangeDateInput,
	{
		defaultValue: () => ({
			to: C.now(),
			from: C.tomorrow(),
		}),
	},
);

const useTimeInput = createInput(
	TimeInput,
	{
		defaultValue: () => C.createTime(9.5, "hour"),
		props: {
			min: C.createTime(8, "hour"),
			max: C.createTime(20, "hour"),
		},
	},
);

const useRangeTimeInput = createInput(
	RangeTimeInput,
	{
		defaultValue: () => ({
			from: C.createTime(8, "hour"),
			to: C.createTime(20, "hour"),
		}),
		props: {
			min: C.createTime(6, "hour"),
			max: C.createTime(22, "hour"),
		},
	},
);

const useFileInput = createInput(
	FileInput,
	{
		defaultValue: () => [] as File[],
		props: {
			accept: ".pdf,.png,.jpg",
			multiple: true,
		},
	},
);

const useDualRangeInput = createInput(
	DualRangeInput,
	{
		defaultValue: () => ({
			start: 5,
			end: 20,
		}),
		props: {
			manual: true,
			min: 0,
			max: 100,
			step: 5,
		},
	},
);

const disabled = ref(false);

const useForm = createForm(
	gridTemplates.useTemplates(),
);

const { component: Form, currentValue, check } = useForm(
	useStepLayout(
		[
			useSectionLayout(
				useDisabledLayout(
					useUnionLayout(
						[
							[
								"Choice one",
								useMultiLayout({
									name: useRepeatLayout(
										useTextInput({
											label: "Name",
											defaultValue: "Default value",
											dataStructure: DS.string().addMessage("need number"),
										}),
										{
											max: 10,
											min: 2,
											template: gridTemplates.useRepeatTemplate({ repeatElementColumn: 6 }),
										},
									),
									age: useCheckLayout(
										useNumberInput({
											label: "Age",
											defaultValue: 26,
										}),
										{
											dataStructure: DS.number([DS.positive(), DS.lessThan(30)]),
											template: gridTemplates.useCheckTemplate({
												columns: 2,
												hideEmptyMessageError: true,
											}),
										},
									),
									bio: useTextArea({
										label: "Bio",
									}),
									score: useRangeInput({
										label: "Score",
									}),
									period: useDualRangeInput({
										label: "Period",
									}),
									slot: useSlotLayout(
										"testSlot",
										{ defaultValue: "" },
									),
								}),
							],
							[
								"Choice two",
								useMultiLayout({
									comment: useSlotLayout(
										"test",
										useTextArea({
											label: "Comment",
											defaultValue: "Another default value",
										}),
									),
									subscribe: useCheckbox({
										label: "Newsletter",
									}),
									policy: useSlotLayout(
										"test",
										useCheckboxPolicy({
											label: "Policy",
										}),
									),
									notificationFrequency: useRadioGroup({
										label: "Frequency",
									}),
									attachments: useFileInput({
										label: "Attachments",
									}),
								}),
							],
						],
						{ defaultKind: "Choice one" },
					),
					{ isDisabled: () => disabled.value },
				),
				{ title: "Profile details" },
			),
			useSectionLayout(
				useMultiLayout({
					stepTitle: useTextInput({
						label: "Step title",
						defaultValue: "Step 2",
					}),
					stepDate: useDateInput({
						label: "Step date",
					}),
					stepRangeDate: useRangeDateInput({
						label: "Step Range Date",
					}),
					stepTime: useTimeInput({
						label: "Step time",
					}),
					stepRangeTime: useRangeTimeInput({
						label: "Step Range Time",
					}),
					stepLevel: useNumberInput({
						label: "Priority",
						defaultValue: 2,
					}),
				}),
				{ title: "Scheduling" },
			),
		],
		{ errorMessageNotAtLastStep: "Form not fully completed" },
	),
);
</script>

<template>
	<div class="playground">
		<Form @submit="console.log(check())">
			<PrimaryButton
				type="submit"
				label="Submit"
			/>

			<template #test="params">
				test
				<component :is="params.formField" />
			</template>

			<template #testSlot="{value, update}">
				<input
					type="text"
					:value="value"
					@input="(event) => update((event.target as unknown as {value: string}).value)"
				/>
			</template>
		</Form>

		<button
			class="playground-disabled-toggle"
			@click="disabled = !disabled"
		>
			{{ disabled ? "Enable" : "Disable" }}
		</button>

		<pre class="playground-output">{{ currentValue }}</pre>
	</div>
</template>

<style lang="scss" scoped>
.playground {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem;
}

.playground-disabled-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2.25rem;
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	font-weight: 600;
	line-height: 1.1;
	cursor: pointer;
	transition:
		background-color 140ms ease,
		border-color 140ms ease,
		box-shadow 140ms ease,
		transform 140ms ease;
}
.playground-disabled-toggle {
	border: 1px solid #cbd5e1;
	background: #f8fafc;
	color: #334155;

	&:hover {
		background: #f1f5f9;
		border-color: #94a3b8;
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px #cbd5e1;
	}

	&:active {
		background: #e2e8f0;
		transform: translateY(1px);
	}
}

.playground-output {
	margin: 0;
	padding: 0.65rem 0.75rem;
	border: 1px solid #e2e8f0;
	border-radius: 0.5rem;
	background: #ffffff;
	font-size: 0.8rem;
	line-height: 1.25;
	white-space: pre-wrap;
	word-break: break-word;
}
</style>
