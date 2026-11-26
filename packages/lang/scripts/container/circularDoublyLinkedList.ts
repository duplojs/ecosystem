import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";

export const circularDoublyLinkedListNodeKind = createKind("circular-doubly-linked-list-node");

export interface CircularDoublyLinkedListNode<
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof circularDoublyLinkedListNodeKind> {
	readonly value: GenericValue;
	readonly next: CircularDoublyLinkedListNode<GenericValue>;
	readonly previous: CircularDoublyLinkedListNode<GenericValue>;
}

class _CircularDoublyLinkedListNode implements Record<
	keyof DKind.Remove<CircularDoublyLinkedListNode>,
	unknown
> {
	public next: _CircularDoublyLinkedListNode = this;

	public previous: _CircularDoublyLinkedListNode = this;

	public constructor(
		public readonly value: unknown,
	) {}

	public [circularDoublyLinkedListNodeKind.runTimeKey] = null;
}

export const circularDoublyLinkedListKind = createKind("circular-doubly-linked-list");

export interface CircularDoublyLinkedList<
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof circularDoublyLinkedListKind>, Iterable<GenericValue, unknown> {
	readonly firstNode: (
		| CircularDoublyLinkedListNode<GenericValue>
		| undefined
	);
	readonly length: number;
	add(value: GenericValue): void;
	prepend(value: GenericValue): void;
	pop(): GenericValue | undefined;
	shift(): GenericValue | undefined;
	first(): GenericValue | undefined;
	last(): GenericValue | undefined;

}

class _CircularDoublyLinkedList implements Record<
	keyof DKind.Remove<CircularDoublyLinkedList>,
	unknown
> {
	public firstNode: _CircularDoublyLinkedListNode | undefined = undefined;

	public length = 0;

	public add(value: unknown) {
		this.length++;

		if (this.firstNode === undefined) {
			this.firstNode = new _CircularDoublyLinkedListNode(value);
		} else {
			const oldLastNode = this.firstNode.previous;
			const newLastNode = new _CircularDoublyLinkedListNode(value);
			newLastNode.next = this.firstNode;
			newLastNode.previous = oldLastNode;

			this.firstNode.previous = newLastNode;
			oldLastNode.next = newLastNode;
		}
	}

	public prepend(value: unknown): void {
		this.add(value);
		this.firstNode = this.firstNode!.previous;
	}

	public pop() {
		if (this.firstNode === undefined) {
			return undefined;
		} else {
			this.length--;
			const oldLast = this.firstNode.previous;

			if (oldLast === this.firstNode) {
				this.firstNode = undefined;
			} else {
				this.firstNode.previous = oldLast.previous;
				oldLast.previous.next = this.firstNode;
			}

			return oldLast.value;
		}
	}

	public shift() {
		if (this.firstNode === undefined) {
			return undefined;
		} else {
			this.length--;
			const oldFirst = this.firstNode;

			if (oldFirst === this.firstNode.next) {
				this.firstNode = undefined;
			} else {
				this.firstNode = oldFirst.next;
				oldFirst.next.previous = oldFirst.previous;
				oldFirst.previous.next = oldFirst.next;
			}

			return oldFirst.value;
		}
	}

	public first() {
		return this.firstNode?.value;
	}

	public last() {
		return this.firstNode?.previous.value;
	}

	public *[Symbol.iterator]() {
		if (this.firstNode === undefined) {
			return;
		}

		let currentNode = this.firstNode;
		do {
			yield currentNode.value;
			currentNode = currentNode.next;
		} while (
			this.firstNode !== undefined
			&& currentNode !== this.firstNode
		);
	}

	public [circularDoublyLinkedListKind.runTimeKey] = null;
}

export function createCircularDoublyLinkedList<
	GenericValue extends unknown = unknown,
>(
	iterable?: Iterable<GenericValue>,
): CircularDoublyLinkedList<GenericValue> {
	const self = new _CircularDoublyLinkedList();

	if (iterable) {
		for (const value of iterable) {
			self.add(value);
		}
	}

	return self as never;
}
