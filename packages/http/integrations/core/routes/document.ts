import { controlBodyAsFormData, ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DPath from "@duplojs/lang/path";
import * as DTuple from "@duplojs/lang/tuple";

useRouteBuilder("POST", "/documents", {
	bodyController: controlBodyAsFormData({
		maxFileQuantity: 10,
		bodyMaxSize: "1.5mb",
	}),
})
	.extract({
		body: {
			bool: DDataStructure.boolean(),
			myFile: DDataStructure.array(DSDataStructure.file(), [DDataStructure.arrayLengthEqual(1)]),
			name: DDataStructure.string(),
		},
	})
	.handler(
		ResponseContract.noContent("file.receive"),
		async(floor, { response }) => {
			const [myFile] = DTuple.from(floor.myFile);
			DCommon.asserts(
				await myFile.move(DPath.createOrThrow(`files/store/${floor.name}.jpg`)),
				DEither.isRight,
			);

			return response("file.receive");
		},
	);

useRouteBuilder("GET", "/documents/*")
	.handler(
		ResponseContract.ok("file.send", DSDataStructure.file()),
		(__, { response }) => response(
			"file.send",
			DSFile.createFileInterface(
				DCommon.cast("files/fakeFiles/superTextFile.txt"),
			),
		),
	);
