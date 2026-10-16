/**
 * @title DCommon.createBuilder
 *
 * Configurer des handlers réutilisables pour construire un objet par étapes.
 */
import * as DCommon from "@duplojs/lang/common";

interface ExampleBuilder extends DCommon.Builder<{ value: string }> {
	build(): { value: string };
}

const handlers = DCommon.createBuilder<ExampleBuilder>("api-documentation-builder").set(
	"build",
	({ accumulator }) => accumulator,
);
const result = handlers.use({ value: "done" }).build();

// Le handler réutilise l’accumulateur et conserve sa forme typée.
type _CheckResult = DCommon.ExpectType<typeof result, { value: string }, "strict">;
