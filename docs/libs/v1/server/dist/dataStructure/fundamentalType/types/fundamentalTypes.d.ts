import { TheFile } from '../file';
import { TheFolder } from '../folder';
declare module "@duplojs/lang/dataStructure" {
    interface FundamentalTypesStore {
        serverFile: TheFile;
        serverFolder: TheFolder;
    }
}
