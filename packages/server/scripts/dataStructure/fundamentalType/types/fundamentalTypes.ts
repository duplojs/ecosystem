import { type TheFile } from "../file";
import { type TheFolder } from "../folder";

declare module "@duplojs/lang/dataStructure" {
	interface FundamentalTypesStore {
		serverFile: TheFile;
		serverFolder: TheFolder;
	}
}
