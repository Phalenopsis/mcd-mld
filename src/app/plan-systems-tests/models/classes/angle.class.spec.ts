import { Angle } from "../../../plan-systems/models/classes/angle.class"

describe('Angle', () => {
    it('should be 90', () => {
        expect(Angle.convertRadiansToDegrees(Math.PI / 2)).toEqual(90);
    })

    it('should be PI/2', () => {
        expect(Angle.convertDegreesToRadians(90)).toEqual(Math.PI / 2);
    })

    it('should be 360', () => {
        expect(Angle.convertRadiansToDegrees(Math.PI * 2)).toEqual(360);
    })

    it('should be PI', () => {
        expect(Angle.convertDegreesToRadians(180)).toEqual(Math.PI);
    })
})