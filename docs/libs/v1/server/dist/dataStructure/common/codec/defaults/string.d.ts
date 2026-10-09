import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as FundamentalType from "../../../fundamentalType";
export declare const codecsString: DDataStructure.Codecs<{
    file: DDataStructure.Codec<FundamentalType.TheFile, string>;
    folder: DDataStructure.Codec<FundamentalType.TheFolder, string>;
    bigint: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheBigint, string>;
    boolean: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheBoolean, "true" | "false">;
    date: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheDate, string>;
    null: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheNull, "null">;
    number: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheNumber, string & import('@duplojs-v1/lang/string').Number>;
    time: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheTime, string>;
    undefined: import('@duplojs-v1/lang/dataStructure').Codec<DDataStructure.TheUndefined, "undefined" | undefined>;
}>;
