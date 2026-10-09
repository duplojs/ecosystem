import { UserConfig } from '@commitlint/types';
export { type UserConfig };
export declare const commitTypes: readonly ["feat", "fix", "docs", "refactor", "config", "test", "ci"];
export declare const typePattern: string;
export declare const scopePattern = "[a-z][a-z0-9-]*";
export declare const referencePattern = "[0-9]+|[a-z][a-z0-9-]*";
export declare const headerPattern: RegExp;
export declare const config: {
    extends: string[];
    parserPreset: {
        parserOpts: {
            headerPattern: RegExp;
            headerCorrespondence: string[];
        };
    };
    rules: {
        "type-enum": [2, "always", readonly ["feat", "fix", "docs", "refactor", "config", "test", "ci"]];
        "scope-empty": [0];
        "scope-case": [2, "always", "kebab-case"];
        "subject-empty": [2, "never"];
        "subject-full-stop": [2, "never", string];
        "header-trim": [2, "always"];
        "header-max-length": [2, "always", number];
        "body-leading-blank": [1, "always"];
        "footer-leading-blank": [1, "always"];
    };
};
