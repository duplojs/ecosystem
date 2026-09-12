interface Console {
	log(...data: any[]): void;
}

declare let console: Console;

interface URL {
	hostname: string;
	protocol: string;
}

declare let URL: {
	prototype: URL;
	new (input: string | { toString: () => string; }, base?: string | URL): URL
};

