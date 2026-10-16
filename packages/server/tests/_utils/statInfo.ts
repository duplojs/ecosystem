import type { DSFile } from "@scripts";

export function createStatInfo(params: Partial<DSFile.StatInfo> = {}): DSFile.StatInfo {
	return {
		isFile: true,
		isDirectory: false,
		isSymlink: false,
		sizeBytes: 1024,
		modifiedAt: null,
		accessedAt: null,
		createdAt: null,
		changedAt: null,
		deviceId: 1,
		inode: 2,
		permissionsMode: 0o644,
		hardLinkCount: 1,
		ownerUserId: 1000,
		ownerGroupId: 1000,
		specialDeviceId: null,
		ioBlockSize: null,
		allocatedBlockCount: null,
		isBlockDevice: false,
		isCharacterDevice: false,
		isFifo: false,
		isSocket: false,
		...params,
	};
}
