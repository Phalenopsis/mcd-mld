import { CartesianCoordinate } from "@plan/models/classes/cartesian-coordinate.class";
import { NodePositionnalRectangle } from "@plan/models/classes/node-positionnal-rectangle.class";
import { Rectangle } from "@plan/models/classes/rectangle.class";

describe('NodePositionnalRectangle', () => {
    describe('test links', () => {
        let node1: NodePositionnalRectangle;
        let node2: NodePositionnalRectangle;
        let node3: NodePositionnalRectangle;
        let node4: NodePositionnalRectangle;
        let node5: NodePositionnalRectangle;

        beforeEach(() => {
            const point1 = new CartesianCoordinate(0, 0);
            const rect1 = new Rectangle(10, 10);
            node1 = new NodePositionnalRectangle(point1, rect1);
            const point2 = new CartesianCoordinate(20, 0);
            const rect2 = new Rectangle(10, 10);
            node2 = new NodePositionnalRectangle(point2, rect2);
            const point3 = new CartesianCoordinate(0, 20);
            const rect3 = new Rectangle(10, 10);
            node3 = new NodePositionnalRectangle(point3, rect3);
            const point4 = new CartesianCoordinate(20, 20);
            const rect4 = new Rectangle(10, 10);
            node4 = new NodePositionnalRectangle(point4, rect4);
            const point5 = new CartesianCoordinate(40, 0);
            const rect5 = new Rectangle(10, 10);
            node5 = new NodePositionnalRectangle(point5, rect5);
        })

        it('should be both ways linked', () => {
            node1.addLink(node2);
            expect(node2.hasLinkTo(node1)).toBeTrue();
        });

        it('should be indirect linked', () => {
            node1.addLink(node2);
            node2.addLink(node3);
            expect(node1.isIndirectLinkedTo(node3)).toBeTrue();
        });

        it('should be indirect linked (longer)', () => {
            node1.addLink(node2);
            node2.addLink(node3);
            node3.addLink(node4);
            node4.addLink(node5);
            expect(node1.isIndirectLinkedTo(node5)).toBeTrue();
        })

        it('should be indirect linked (diamond link)', () => {
            node1.addLink(node2);
            node1.addLink(node3);
            node1.addLink(node4);
            node2.addLink(node3);
            node2.addLink(node4);
            node3.addLink(node4);
            node4.addLink(node5);
            expect(node1.isIndirectLinkedTo(node5)).toBeTrue();
        })

        it('should not be indirect linked', () => {
            node1.addLink(node2);
            node2.addLink(node3);
            expect(node1.isIndirectLinkedTo(node4)).toBeFalse();
        });
    });

    describe('test divide', () => {
        let plan: NodePositionnalRectangle;
        let parts: NodePositionnalRectangle[];

        beforeEach(() => {
            const point1 = new CartesianCoordinate(0, 0);
            const rect1 = new Rectangle(120, 120);
            plan = new NodePositionnalRectangle(point1, rect1);
            parts = plan.divideInRects(9);
        });

        it('should be cut in 9 parts', () => {
            expect(parts.length).toEqual(9);
        });

        it('should have 3 links for first part', () => {
            expect(parts[0].getLinks().size).toEqual(3);
        });

        it('should have 8 links for 5th part', () => {
            expect(parts[4].getLinks().size).toEqual(8);
        });

        it('should have 3 links for last part', () => {
            expect(parts[8].getLinks().size).toEqual(3);
        })
    })
});