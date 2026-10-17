import { OxlintOverride } from 'oxlint';
import { OxlintRules } from './defineRules';
export interface OxlintRuleset {
    base?: boolean;
    open?: boolean;
    test?: boolean;
}
export interface CreateOxlintOverrideParams extends Omit<OxlintOverride, "rules"> {
    ruleset?: OxlintRuleset;
    customRules?: OxlintRules;
}
export declare function createOxlintOverride(params: CreateOxlintOverrideParams): OxlintOverride;
