interface Console {
	error(...data: any[]): void;
}

declare let console: Console;

interface File {

}

declare let File: {
	prototype: File;
	new(): File;
};
