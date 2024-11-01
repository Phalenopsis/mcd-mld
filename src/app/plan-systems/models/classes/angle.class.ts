export abstract class Angle {
    static convertDegreesToRadians(valueInDegrees: number): number {
        return valueInDegrees * Math.PI / 180;
    }

    static convertRadiansToDegrees(valueInRadians: number): number {
        return valueInRadians * 180 / Math.PI;
    }

}