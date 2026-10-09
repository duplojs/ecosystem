import { default as parserTs } from '@typescript-eslint/parser';
import { FlatConfig } from 'typescript-eslint';
export declare const baseConfig: {
    readonly plugins: {
        readonly "@stylistic": {
            rules: import('@stylistic/eslint-plugin').Rules;
            configs: import("eslint").ESLint.Plugin["configs"] & import('@stylistic/eslint-plugin').Configs;
        };
        readonly "@typescript-eslint": {
            configs: Record<string, import("@typescript-eslint/utils/ts-eslint").ClassicConfig.Config>;
            meta: FlatConfig.PluginMeta;
            rules: typeof import("@typescript-eslint/eslint-plugin/use-at-your-own-risk/rules");
        };
    };
    readonly languageOptions: {
        readonly parser: typeof parserTs;
        readonly parserOptions: {
            readonly projectService: true;
        };
    };
};
