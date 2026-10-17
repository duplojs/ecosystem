import { DummyRuleMap } from 'oxlint';
type RemoveIndexSignature<GenericObject extends object> = {
    [GenericKey in keyof GenericObject as (string extends GenericKey ? never : number extends GenericKey ? never : symbol extends GenericKey ? never : GenericKey)]: GenericObject[GenericKey];
};
export type OxlintRules = RemoveIndexSignature<DummyRuleMap>;
export declare function defineRules<const GenericRules extends OxlintRules>(rules: GenericRules & Record<Exclude<keyof GenericRules, keyof OxlintRules>, never>): GenericRules;
export {};
