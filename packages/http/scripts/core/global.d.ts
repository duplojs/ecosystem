interface Console {
	error(...data: any[]): void;
}

declare let console: Console;
