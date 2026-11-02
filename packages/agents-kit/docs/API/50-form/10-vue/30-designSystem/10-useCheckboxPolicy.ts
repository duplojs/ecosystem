/**
 * @title useCheckboxPolicy
 *
 * Présenter une case de consentement.
 */
import { useCheckboxPolicy } from "@duplojs/form/vueDesignSystem";

// La case est initialement décochée ; check échoue tant que required est vrai et que la case reste décochée.
const policy = useCheckboxPolicy({
	label: "Privacy policy",
	props: {
		title: "I accept the privacy policy",
		required: true,
		errorMessage: "Acceptance is required",
	},
});

void policy;
