import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as FundamentalType from "../../../fundamentalType";
export declare const codecsString: DDataStructure.Codecs<{
    file: DDataStructure.Codec<FundamentalType.TheFile, string>;
    folder: DDataStructure.Codec<FundamentalType.TheFolder, string>;
    bigint: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheBigint, string>;
    boolean: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheBoolean, "true" | "false">;
    date: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheDate, string>;
    null: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheNull, "null">;
    number: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheNumber, string & import('@duplojs/lang/string').Number>;
    time: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheTime, string>;
    undefined: import('@duplojs/lang/dataStructure').Codec<DDataStructure.TheUndefined, "undefined" | undefined>;
}>;
