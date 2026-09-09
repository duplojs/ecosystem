interface AbortController {
	readonly signal: AbortSignal;
	abort(reason?: any): void;
}

declare let AbortController: {
	prototype: AbortController;
	new(): AbortController;
};

interface AbortSignal {
	readonly aborted: boolean;
	readonly reason: any;
}

declare let AbortSignal: {
	prototype: AbortSignal;
	new(): AbortSignal;
};

interface File {

}

declare let File: {
	prototype: File;
	new(): File;
};

interface FormData {
	append(name: string, value: string | File): void;
}

declare let FormData: {
	prototype: FormData;
	new(): FormData;
};

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
	new(url: string | URL): URL;
};

declare function clearTimeout(id: number | undefined): void;

declare function setTimeout(handler: () => void, timeout?: number): number;
