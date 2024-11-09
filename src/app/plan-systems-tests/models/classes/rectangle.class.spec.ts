import { CartesianCoordinate } from "@plan/models/classes/cartesian-coordinate.class";
import { Rectangle } from "@plan/models/classes/rectangle.class";

describe('Rectangle', () => {
    const rect = new Rectangle(10, 10);

    it('should be 100 area for rectange(10, 10)', () => {
        expect(rect.getArea()).toEqual(100);
    });

    it('should be 40 perimeter for rectange(10, 10)', () => {
        expect(rect.getPerimeter()).toEqual(40);
    });

    it('should be (5, 5) center for rectange(10, 10)', () => {
        expect(rect.getCenter()).toEqual(new CartesianCoordinate(5, 5));
    });
});