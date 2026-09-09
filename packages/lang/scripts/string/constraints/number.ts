import { type NumberInString } from "../types";
import { type Format } from "./format";

export interface Number extends Format<"number", NumberInString> {}
