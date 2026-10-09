import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as FundamentalType from "../../../fundamentalType";
export declare const codecsJson: DDataStructure.Codecs<{
    file: DDataStructure.Codec<FundamentalType.TheFile, string>;
    folder: DDataStructure.Codec<FundamentalType.TheFolder, string>;
    bigint: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheBigint, string>;
    date: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheDate, string>;
    time: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheTime, string>;
}>;
