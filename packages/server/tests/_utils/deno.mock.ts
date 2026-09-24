type DenoErrorClass = new (message?: string) => Error;

interface DenoMock {
	errors?: {
		NotFound: DenoErrorClass;
		PermissionDenied: DenoErrorClass;
		NotCapable: DenoErrorClass;
		IsADirectory: DenoErrorClass;
		NotADirectory: DenoErrorClass;
		InvalidData: DenoErrorClass;
		Busy: DenoErrorClass;
		AlreadyExists: DenoErrorClass;
	};
	env?: {
		toObject(): Record<string, string>;
		set(key: string, value: string): void;
		delete?(key: string): void;
	};
	cwd?(): string;
	chdir?(path: string): void;
	readFile?(path: string): Promise<Uint8Array>;
	readTextFile?(path: string): Promise<string>;
	writeFile?(path: string, data: Uint8Array, options?: { append?: boolean }): Promise<void>;
	writeTextFile?(path: string, data: string, options?: { append?: boolean }): Promise<void>;
	mkdir?(path: string, options?: { recursive?: boolean }): Promise<void>;
	remove?(path: string, options?: { recursive?: boolean }): Promise<void>;
	rename?(fromPath: string, toPath: string): Promise<void>;
	truncate?(path: string, size?: number): Promise<void>;
	chmod?(path: string, mode: number): Promise<void>;
	chown?(path: string, userId: number, groupId: number): Promise<void>;
	utime?(path: string, accessTime: number, modifiedTime: number): Promise<void>;
	symlink?(oldPath: string, newPath: string, params?: { type?: "file" | "dir" | "junction" }): Promise<void>;
	readLink?(path: string): Promise<string>;
	link?(existingPath: string, newPath: string): Promise<void>;
	makeTempDir?(options?: { prefix?: string }): Promise<string>;
	makeTempFile?(options?: {
		prefix?: string;
		suffix?: string;
	}): Promise<string>;
	stat?(path: string): Promise<unknown>;
	lstat?(path: string): Promise<unknown>;
	realPath?(path: string): Promise<string>;
	open?(path: string, options?: {
		write?: boolean;
		create?: boolean;
		append?: boolean;
	}): Promise<{ close(): void }>;
}

const globalWithDeno = globalThis as unknown as { Deno?: DenoMock };

export const denoErrorsMock = {
	NotFound: class NotFound extends Error {},
	PermissionDenied: class PermissionDenied extends Error {},
	NotCapable: class NotCapable extends Error {},
	IsADirectory: class IsADirectory extends Error {},
	NotADirectory: class NotADirectory extends Error {},
	InvalidData: class InvalidData extends Error {},
	Busy: class Busy extends Error {},
	AlreadyExists: class AlreadyExists extends Error {},
};

export function setDenoMock(mock: DenoMock) {
	globalWithDeno.Deno = {
		errors: denoErrorsMock,
		...mock,
	};
}
