import { nodeFileSystem } from "@scripts/implementor";

const fsPromisesMock = {
	readFile: vi.fn(),
	writeFile: vi.fn(),
	appendFile: vi.fn(),
	access: vi.fn(),
	stat: vi.fn(),
	lstat: vi.fn(),
	realpath: vi.fn(),
	readdir: vi.fn(),
	mkdir: vi.fn(),
	rm: vi.fn(),
	cp: vi.fn(),
	rename: vi.fn(),
	truncate: vi.fn(),
	chmod: vi.fn(),
	chown: vi.fn(),
	utimes: vi.fn(),
	symlink: vi.fn(),
	readlink: vi.fn(),
	link: vi.fn(),
	mkdtemp: vi.fn(),
	open: vi.fn(),
};

export function getFsPromisesMock() {
	return fsPromisesMock;
}

export function setFsPromisesMock(
	overrides: Partial<typeof fsPromisesMock>,
) {
	vi.spyOn(nodeFileSystem, "value", "get").mockReturnValue(fsPromisesMock as unknown as typeof nodeFileSystem.value);
	for (const key of Object.keys(overrides) as (keyof typeof fsPromisesMock)[]) {
		const value = overrides[key];
		if (value) {
			fsPromisesMock[key] = value;
		}
	}
	return fsPromisesMock;
}
