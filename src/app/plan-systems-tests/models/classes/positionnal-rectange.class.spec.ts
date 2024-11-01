import { CartesianCoordinate } from "../../../plan-systems/models/classes/cartesian-coordinate.class";
import { PositionnalRectangle } from "../../../plan-systems/models/classes/positionnal-rectangle.class";
import { Rectangle } from "../../../plan-systems/models/classes/rectangle.class";

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
    })

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
    })

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
    })
})