import { useCheckerBuilder, useProcessBuilder, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

useRouteBuilder("POST", "/rejections/extract")
	.extract({ body: { id: DDataStructure.number() } })
	.handler((floor, { response }) => response.noContent("handled"));

const checker = useCheckerBuilder()
	.handler((allowed: boolean, { output }) => Promise.resolve(allowed
		? output("allowed", undefined)
		: output("denied", "access-denied")));
useRouteBuilder("GET", "/rejections/checker")
	.check(checker, {
		input: () => false,
		result: "allowed",
		otherwise: ({ response, result }) => response.forbidden("checker-rejected", { reason: result.value }),
	})
	.cut(() => {
		throw new Error("Route continued after rejection");
	})
	.handler((floor, { response }) => response.noContent("handled"));

const innerProcess = useProcessBuilder()
	.cut((floor, { response }) => Promise.resolve(response.conflict("process-rejected", { reason: "nested" })))
	.exports();
const outerProcess = useProcessBuilder()
	.exec(innerProcess)
	.cut(() => {
		throw new Error("Process continued after rejection");
	})
	.exports();
useRouteBuilder("GET", "/rejections/process")
	.exec(outerProcess)
	.cut(() => {
		throw new Error("Route continued after rejection");
	})
	.handler((floor, { response }) => response.noContent("handled"));
