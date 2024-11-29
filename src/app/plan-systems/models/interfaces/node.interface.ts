export interface NodeInterface<T> {
    addLink(node: T): void;

    hasLinkTo(node: T): boolean;

    isIndirectLinkedTo(node: T, visited: Set<T>): boolean;

    getLinks(): Set<T>;
}