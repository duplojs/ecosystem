import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as FundamentalType from "../../../fundamentalType";
export declare const codecsJson: DDataStructure.Codecs<{
    file: DDataStructure.Codec<FundamentalType.TheFile, string>;
    folder: DDataStructure.Codec<FundamentalType.TheFolder, string>;
    bigint: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheBigint, string>;
    date: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheDate, string>;
    time: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheTime, string>;
}>;
