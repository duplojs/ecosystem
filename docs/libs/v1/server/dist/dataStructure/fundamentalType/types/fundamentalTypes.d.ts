import { TheFile } from '../file';
import { TheFolder } from '../folder';
declare module "@duplojs-v1/lang/dataStructure" {
    interface FundamentalTypesStore {
        serverFile: TheFile;
        serverFolder: TheFolder;
    }
}
