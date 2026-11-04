/**
 * @title DPath.concatSegment
 *
 * Assembler un segment avec un ou plusieurs autres segments.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const fileName = DPath.declareSegment("file");
const extension = DPath.declareSegment(".ts");

// L’appel direct assemble deux segments.
const result = DPath.concatSegment(fileName, extension);
// La valeur obtenue est file.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Segment, "strict">;

// La forme curifiée configure le segment ajouté avant de recevoir le segment de base.
const appendExtension = DPath.concatSegment(extension);
const curriedResult = appendExtension(fileName);
type _CheckCurriedResult = DCommon.ExpectType<typeof curriedResult, string & DPath.Segment, "strict">;
