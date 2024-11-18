import { CartesianCoordinate } from "@plan/models/classes/cartesian-coordinate.class";
import { PolarCoordinate } from "@plan/models/classes/polar-coordinate.class";
import { Rectangle } from "@plan/models/classes/rectangle.class";


describe('Coordinate', () => {
    it('should be (0, 0) as PolarCoordinate', () => {
        const zeroCordinate = new CartesianCoordinate(0, 0);
        expect(zeroCordinate.toPolar()).toEqual(new PolarCoordinate(0, 0));
    });

    it('should be (100, 0) as PolarCoordinate', () => {
        const coordinate1 = new CartesianCoordinate(100, 0);
        expect(coordinate1.toPolar()).toEqual(new PolarCoordinate(100, 0));
    });

    it('should be (?, 45°) as PolarCoordinate', () => {
        const coordinate2 = new CartesianCoordinate(50, 50);
        const radius = Math.sqrt(50 ** 2 + 50 ** 2);
        const angle = 45;
        expect(coordinate2.toPolar()).toEqual(new PolarCoordinate(radius, angle));
    });

    it('should be (-100, 180°) as PolarCoordinate', () => {
        const coordinate = new CartesianCoordinate(-100, 0);
        expect(coordinate.toPolar()).toEqual(new PolarCoordinate(100, 180));
    });

    it('calc cartesian distance : should be 100', () => {
        const point1 = new CartesianCoordinate(-100, 0);
        const point2 = new CartesianCoordinate(0, 0);
        expect(point1.distanceTo(point2)).toEqual(100);
        expect(point2.distanceTo(point1)).toEqual(100);
    });

    it('calc polar distance : should be 100', () => {
        const point3 = new PolarCoordinate(50, 0);
        const point4 = new PolarCoordinate(50, 180);
        expect(point3.distanceTo(point4)).toEqual(100);
        expect(point4.distanceTo(point3)).toEqual(100);
    });

    it('should not be same', () => {
        const point1 = new CartesianCoordinate(-100, 0);
        const point2 = new CartesianCoordinate(0, 0);
        expect(point1.isSame(point2)).toBeFalse();
        expect(point2.isSame(point1)).toBeFalse();
    });

    it('should be same', () => {
        const point1 = new CartesianCoordinate(45, 45);
        const point2 = new CartesianCoordinate(45, 45);
        const polarPoint3 = new PolarCoordinate(50, 360);
        const point3 = polarPoint3.toCartesian();
        const polarPoint4 = new PolarCoordinate(50, 0);
        const point4 = polarPoint4.toCartesian();

        expect(point1.isSame(point2)).toBeTrue();
        expect(polarPoint3.isSame(polarPoint4)).toBeFalse();
        expect(point3.isSame(point4)).toBeTrue();
    });

    it('should be (100, 100)', () => {
        const point1 = new CartesianCoordinate(0, 0);
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200
        const rect = Rectangle.buildFromCanvas(canvas);

        expect(point1.transformIntoCanvasCoordinate(rect)).toEqual(new CartesianCoordinate(100, 100));
    });
});