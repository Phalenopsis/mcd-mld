import { MINIMUM_ACCEPTABLE_DIFFERENCE } from "../../constants/constants.constant";
import { Coordinate } from "../interfaces/coordinate.interface";
import { Angle } from "./angle.class";
import { CartesianCoordinate } from "./cartesian-coordinate.class";

/**
     * For calculation, angle is in radians. 
     * As degrees are more intuitive for most people, a PolarCoordinate instancied 
     * with 2 parameters take angle in degrees.
     * A new PolarCoordinate could be instancied with radians angle by putting a 
     * third parameter to false.
     * 
     * @param radius
     * @param angle 
     * @param degre: boolean (optionnal = true) If false, angle is in radians. 
     */
export class PolarCoordinate implements Coordinate<PolarCoordinate> {

    /**
     * 
     * @param radius 
     * @param angle  if degree == false, angle must be in radians
     * @param degree 
     */
    constructor(public radius: number, public angle: number, degree = true) {
        if (degree) this.angle = Angle.convertDegreesToRadians(angle);
    }

    toCartesian(): CartesianCoordinate {
        const x = this.radius * Math.cos(this.angle);
        const y = this.radius * Math.sin(this.angle);

        return new CartesianCoordinate(x, y);
    }

    isSame(point: PolarCoordinate) {
        return Math.abs(this.radius - point.radius) <= MINIMUM_ACCEPTABLE_DIFFERENCE
            && Math.abs(this.angle - point.angle) <= MINIMUM_ACCEPTABLE_DIFFERENCE;
    }

    distanceTo(point: PolarCoordinate): number {
        return Math.sqrt(
            this.radius ** 2
            + point.radius ** 2
            - 2 * this.radius * point.radius * Math.cos(this.angle - point.angle)
        );
    }
}