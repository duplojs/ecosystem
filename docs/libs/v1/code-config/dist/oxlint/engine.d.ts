export declare const engineConfig: {
    plugins: ("eslint" | "typescript")[];
    jsPlugins: {
        name: string;
        specifier: string;
    }[];
    categories: {
        correctness: "off";
        nursery: "off";
        pedantic: "off";
        perf: "off";
        restriction: "off";
        style: "off";
        suspicious: "off";
    };
    options: {
        typeAware: true;
        reportUnusedDisableDirectives: "error";
        respectEslintDisableDirectives: true;
    };
};
