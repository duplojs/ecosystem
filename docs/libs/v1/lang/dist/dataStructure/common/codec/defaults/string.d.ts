import * as DString from '../../../../string';
import * as FundamentalType from "../../../fundamentalType";
export declare const codecsString: import('../../..').Codecs<{
    bigint: import('../../..').Codec<FundamentalType.TheBigint, string>;
    boolean: import('../../..').Codec<FundamentalType.TheBoolean, "true" | "false">;
    date: import('../../..').Codec<FundamentalType.TheDate, string>;
    null: import('../../..').Codec<FundamentalType.TheNull, "null">;
    number: import('../../..').Codec<FundamentalType.TheNumber, string & DString.Number>;
    time: import('../../..').Codec<FundamentalType.TheTime, string>;
    undefined: import('../../..').Codec<FundamentalType.TheUndefined, "undefined" | undefined>;
}>;
