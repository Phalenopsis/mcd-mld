import { NodeInterface } from "@plan/models/interfaces/node.interface";
import { McdTable } from "./mcd-table.class";

export class McdNode implements NodeInterface<McdNode> {
    links: Set<McdNode> = new Set();

    constructor(private table: McdTable) {

    }

    addLink(node: McdNode): void {
        if (!this.links.has(node)) this.links.add(node);
        if (!node.hasLinkTo(this)) node.addLink(this);
    }

    hasLinkTo(node: McdNode): boolean {
        return this.links.has(node);
    }

    isIndirectLinkedTo(node: McdNode, visited: Set<McdNode> = new Set): boolean {
        visited.add(this);
        if (this.hasLinkTo(node)) return true;
        for (let link of this.links) {
            if (visited.has(link)) continue;
            if (link.isIndirectLinkedTo(node, visited)) return true;
        }
        return false;
    }

    getLinks(): Set<McdNode> {
        return this.links;
    }
}