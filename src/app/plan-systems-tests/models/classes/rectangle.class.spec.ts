import { CartesianCoordinate } from "@plan/models/classes/cartesian-coordinate.class";
import { Rectangle } from "@plan/models/classes/rectangle.class";
import { NumberOfCut } from "@plan/models/types/number-of-cut.type";

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

    describe('Cuting Rectangle', () => {
        it('should be cut once horizontaly and once verticaly to cut a square into 4', () => {
            const cutResult: NumberOfCut = rect.calcDivideInParts(4);
            expect(cutResult).toEqual({ horizontally: 1, vertically: 1 });
        });

        it('should be cut twice h and v if 9 pieces are wanted', () => {
            const cutResult: NumberOfCut = rect.calcDivideInParts(9);
            expect(cutResult).toEqual({ horizontally: 2, vertically: 2 });
        });

        it('sould be cut in 6', () => {
            const cutResult: NumberOfCut = rect.calcDivideInParts(6);
            expect(cutResult).toEqual({ horizontally: 2, vertically: 1 });
        });
    });

    describe('Divide a 12 * 12 Rectangle into 9 parts', () => {
        const plan = new Rectangle(12, 12);
        const divisions = plan.divideInRects(9);

        it('sould have 9 parts with width = 4 and height = 4', () => {
            expect(divisions.length).toBe(9);
            expect(divisions[0].getWidth()).toBe(4);
            expect(divisions.filter(rect => rect.getWidth() === 4).length).toBe(9);
            expect(divisions.filter(rect => rect.getHeight() === 4).length).toBe(9);
        });

        it('sould have first rect at (0,0)', () => {
            expect(divisions[0].getPoint()).toEqual(new CartesianCoordinate(0, 0));
        });
        it('sould have last rect at (8,8)', () => {
            expect(divisions[8].getPoint()).toEqual(new CartesianCoordinate(8, 8));
        });

    })
});