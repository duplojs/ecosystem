import { FlatConfig } from 'typescript-eslint';
export type Environment = "vue/ts" | "ts";
export interface Ruleset {
    base?: boolean;
    open?: boolean;
    test?: boolean;
    vue?: boolean;
}
export interface CreateEslintConfigParams {
    environment: "vue/ts" | "ts";
    ruleset?: Ruleset;
    customRules?: FlatConfig.Rules;
    files: (string | string[])[];
}
export declare function createEslintConfig(params: CreateEslintConfigParams): {
    files: (string | string[])[];
    rules: {
        [x: string]: import("@typescript-eslint/utils/ts-eslint").SharedConfig.RuleEntry | undefined;
    };
    basePath?: string;
    ignores?: string[];
    language?: string;
    languageOptions?: FlatConfig.LanguageOptions;
    linterOptions?: FlatConfig.LinterOptions;
    name?: string;
    plugins?: FlatConfig.Plugins;
    processor?: string | FlatConfig.Processor;
    settings?: FlatConfig.Settings;
};
