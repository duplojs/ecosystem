import { default as vueParser } from 'vue-eslint-parser';
import { default as tsParser } from '@typescript-eslint/parser';
import { FlatConfig } from 'typescript-eslint';
export declare const vueConfig: {
    readonly languageOptions: {
        readonly parser: typeof vueParser;
        readonly parserOptions: {
            readonly parser: typeof tsParser;
            readonly sourceType: "module";
            readonly extraFileExtensions: [".vue"];
            readonly projectService: true;
        };
    };
    readonly plugins: {
        readonly vue: {
            meta: any;
            configs: {
                base: import("eslint").Linter.LegacyConfig;
                "vue2-essential": import("eslint").Linter.LegacyConfig;
                "vue2-strongly-recommended": import("eslint").Linter.LegacyConfig;
                "vue2-strongly-recommended-error": import("eslint").Linter.LegacyConfig;
                "vue2-recommended": import("eslint").Linter.LegacyConfig;
                "vue2-recommended-error": import("eslint").Linter.LegacyConfig;
                essential: import("eslint").Linter.LegacyConfig;
                "strongly-recommended": import("eslint").Linter.LegacyConfig;
                "strongly-recommended-error": import("eslint").Linter.LegacyConfig;
                recommended: import("eslint").Linter.LegacyConfig;
                "recommended-error": import("eslint").Linter.LegacyConfig;
                "flat/base": import("eslint").Linter.FlatConfig[];
                "flat/vue2-essential": import("eslint").Linter.FlatConfig[];
                "flat/vue2-strongly-recommended": import("eslint").Linter.FlatConfig[];
                "flat/vue2-strongly-recommended-error": import("eslint").Linter.FlatConfig[];
                "flat/vue2-recommended": import("eslint").Linter.FlatConfig[];
                "flat/vue2-recommended-error": import("eslint").Linter.FlatConfig[];
                "flat/essential": import("eslint").Linter.FlatConfig[];
                "flat/strongly-recommended": import("eslint").Linter.FlatConfig[];
                "flat/strongly-recommended-error": import("eslint").Linter.FlatConfig[];
                "flat/recommended": import("eslint").Linter.FlatConfig[];
                "flat/recommended-error": import("eslint").Linter.FlatConfig[];
                "no-layout-rules": import("eslint").Linter.LegacyConfig;
            };
            rules: Record<string, any>;
            processors: {
                ".vue": any;
                vue: any;
            };
        };
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
    readonly processor: "vue/vue";
};
