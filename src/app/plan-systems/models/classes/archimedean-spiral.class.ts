import { CartesianCoordinate } from "./cartesian-coordinate.class";
import { PolarCoordinate } from "./polar-coordinate.class";

/**
 * 
 * @param distanceBetweenLoops
 * @param nbPointsByLoop 
 * @param nbTurns 
 * @param additionalAngle : angle in radians
 */
export class ArchimedeanSpiral {
    private polarPoints: PolarCoordinate[] = [];
    private cartesianPoints: CartesianCoordinate[] = [];

    constructor(distanceBetweenLoops: number, nbPointsByLoop: number, nbTurns: number, additionalAngle: number = 0) {
        this.#setPolarPoints(distanceBetweenLoops, nbPointsByLoop, nbTurns, additionalAngle);
        this.#setCartesianPoints();
    }

    getCartesianPoints(): CartesianCoordinate[] {
        return this.cartesianPoints;
    }

    #setPolarPoints(distanceBetweenLoops: number, nbPointsByLoop: number, nbTurns: number, additionalAngle: number = 0) {
        for (let i = 0; i < nbTurns * Math.abs(nbPointsByLoop); i += 1) {
            const angle = i * Math.PI * 2 / nbPointsByLoop;
            const radius = distanceBetweenLoops * angle / Math.PI;
            this.polarPoints.push(new PolarCoordinate(radius, angle + additionalAngle, false));
        }
    }

    #setCartesianPoints() {
        this.cartesianPoints = this.polarPoints.map((polarPoint: PolarCoordinate) => polarPoint.toCartesian());
    }
}