import { NodeInterface } from "../interfaces/node.interface";
import { NumberOfCut } from "../types/number-of-cut.type";
import { CartesianCoordinate } from "./cartesian-coordinate.class";
import { PositionnalRectangle } from "./positionnal-rectangle.class";
import { Rectangle } from "./rectangle.class";

export class NodePositionnalRectangle extends PositionnalRectangle implements NodeInterface<NodePositionnalRectangle> {
    links: Set<NodePositionnalRectangle> = new Set();

    addLink(node: NodePositionnalRectangle): void {
        if (!this.links.has(node)) this.links.add(node);
        if (!node.hasLinkTo(this)) node.addLink(this);
    }

    hasLinkTo(node: NodePositionnalRectangle): boolean {
        return this.links.has(node);
    }

    getLinks(): Set<NodePositionnalRectangle> {
        return this.links;
    }

    isIndirectLinkedTo(
        node: NodePositionnalRectangle,
        visited: Set<NodePositionnalRectangle> = new Set()
    ): boolean {
        visited.add(this);
        if (this.hasLinkTo(node)) return true;
        for (let link of this.links) {
            if (visited.has(link)) continue;
            if (link.isIndirectLinkedTo(node, visited)) return true;
        }
        return false;
    }

    override divideInRects(numberParts: number, xStart: number = 0, yStart: number = 0): NodePositionnalRectangle[] {
        const parts = [];
        const numberOfCut: NumberOfCut = this.getRect().calcDivideInParts(numberParts);
        const width = this.getWidth() / (numberOfCut.horizontally + 1);
        const height = this.getHeight() / (numberOfCut.vertically + 1);
        for (let x = 0; x <= numberOfCut.horizontally; x += 1) {
            for (let y = 0; y <= numberOfCut.vertically; y += 1) {
                const position = new CartesianCoordinate(x * width + xStart, y * height + yStart);
                const rect = new NodePositionnalRectangle(position, new Rectangle(width, height));
                this.#findLinks(rect, parts);
                parts.push(rect);
            }
        }
        return parts;
    }

    #findLinks(rect: NodePositionnalRectangle, parts: NodePositionnalRectangle[]) {
        for (let part of parts) {
            if (part.#touchAnother(rect)) {
                rect.addLink(part);
            }
        }
    }

    #touchAnother(node: NodePositionnalRectangle): boolean {
        const corners = this.#getCorners();
        const nodeCorner = node.#getCorners();
        for (let pos of corners) {
            for (let nodePos of nodeCorner) {
                if (pos.isSame(nodePos)) return true;
            }
        }
        return false;
    }

    #getCorners(): Set<CartesianCoordinate> {
        const topLeft = this.getPoint();
        const bottomRight = this.getBottomRightPoint();
        const topRight = new CartesianCoordinate(this.getXLimit(), this.getY());
        const bottomLeft = new CartesianCoordinate(this.getX(), this.getYLimit());
        return new Set([topLeft, bottomRight, topRight, bottomLeft]);
    }
}