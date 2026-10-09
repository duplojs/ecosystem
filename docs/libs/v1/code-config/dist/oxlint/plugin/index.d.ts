export * from './rules';
export declare const plugin: {
    readonly meta: {
        readonly name: "duplojs-plugin";
    };
    readonly rules: {
        readonly camelcase: import("eslint").Rule.RuleModule;
        readonly "dot-notation": import("eslint").Rule.RuleModule;
        readonly "no-unreachable-loop": import("eslint").Rule.RuleModule;
        readonly "prefer-destructuring": import("eslint").Rule.RuleModule;
        readonly "prefer-namespace-import": import("eslint").Rule.RuleModule;
        readonly "no-restricted-import": import("eslint").Rule.RuleModule;
    };
};
export declare const pluginSpecifier = "@duplojs-v1/code-config/oxlint/plugin";
export default plugin;
