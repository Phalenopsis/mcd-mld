import { CartesianCoordinate } from "@plan/models/classes/cartesian-coordinate.class";
import { PositionnalRectangle } from "@plan/models/classes/positionnal-rectangle.class";
import { Rectangle } from "@plan/models/classes/rectangle.class";

describe('PositionnalRectangle', () => {
    it('should be same', () => {
        const rect1 = new PositionnalRectangle(
            new CartesianCoordinate(0, 0),
            new Rectangle(10, 10)
        );
        const rect2 = new PositionnalRectangle(
            new CartesianCoordinate(0, 0),
            new Rectangle(10, 10)
        );
        const rect3 = new PositionnalRectangle(
            new CartesianCoordinate(1, 1),
            new Rectangle(11, 11)
        );
        expect(rect1.isSame(rect2)).toBeTrue();
        expect(rect1.isSame(rect3)).toBeFalse();
    });

    it('should overlap', () => {
        const rect1 = new PositionnalRectangle(
            new CartesianCoordinate(0, 0),
            new Rectangle(10, 10)
        );
        const rect2 = new PositionnalRectangle(
            new CartesianCoordinate(5, 5),
            new Rectangle(10, 10)
        );
        expect(rect1.isOverlap(rect2)).toBeTrue();
        expect(rect2.isOverlap(rect1)).toBeTrue();
    });

    it('should not overlap', () => {
        const rect1 = new PositionnalRectangle(
            new CartesianCoordinate(0, 0),
            new Rectangle(10, 10)
        );
        const rect2 = new PositionnalRectangle(
            new CartesianCoordinate(11, 11),
            new Rectangle(10, 10)
        );

        const rect3 = new PositionnalRectangle(
            new CartesianCoordinate(0, 11),
            new Rectangle(10, 10)
        );
        const rect4 = new PositionnalRectangle(
            new CartesianCoordinate(11, 0),
            new Rectangle(10, 10)
        );

        expect(rect1.isOverlap(rect2)).toBeFalse();
        expect(rect1.isOverlap(rect3)).toBeFalse();
        expect(rect1.isOverlap(rect4)).toBeFalse();
        expect(rect2.isOverlap(rect1)).toBeFalse();
    });

    it('should test limits', () => {
        const rect1 = new PositionnalRectangle(
            new CartesianCoordinate(0, 0),
            new Rectangle(10, 10)
        );
        const limX = rect1.getXLimit();
        const limY = rect1.getYLimit();
        expect(limX).toEqual(10);
        expect(limY).toEqual(10);
    });

    it('should be 10 distance', () => {
        const rect1 = new PositionnalRectangle(
            new CartesianCoordinate(0, 0),
            new Rectangle(10, 10)
        );
        const rect2 = new PositionnalRectangle(
            new CartesianCoordinate(10, 0),
            new Rectangle(10, 10)
        );
        const dist = rect1.distanceTo(rect2);
        expect(dist).toEqual(10);
    });

    it('should divide in 4 parts', () => {
        const rect1 = new PositionnalRectangle(
            new CartesianCoordinate(0, 0),
            new Rectangle(10, 10)
        );

        const parts = rect1.divideInRects(4);
        expect(parts.length).toEqual(4);
        expect(parts[0].getPoint()).toEqual(new CartesianCoordinate(0, 0));
        expect(parts[1].getPoint()).toEqual(new CartesianCoordinate(0, 5));
        expect(parts[2].getPoint()).toEqual(new CartesianCoordinate(5, 0));
        expect(parts[3].getPoint()).toEqual(new CartesianCoordinate(5, 5));
        expect(parts[3].getRect()).toEqual(new Rectangle(5, 5));
    });
});