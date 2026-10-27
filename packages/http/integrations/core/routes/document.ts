import { controlBodyAsFormData, useRouteBuilder } from "@duplojs/http";
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
		async(floor, { response }) => {
			const [myFile] = DTuple.from(floor.myFile);
			DCommon.asserts(
				await myFile.move(DPath.createOrThrow(`files/store/${floor.name}.jpg`)),
				DEither.isRight,
			);

			return response.noContent("file.receive");
		},
	);

useRouteBuilder("GET", "/documents/*")
	.handler(
		(__, { response }) => response.ok(
			"file.send",
			DSFile.createFileInterface(
				DPath.declarePath("files/fakeFiles/superTextFile.txt"),
			),
		),
	);
