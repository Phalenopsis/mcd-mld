import { MINIMUM_ACCEPTABLE_DIFFERENCE } from "../../../plan-systems/constants/constants.constant";
import { ArchimedeanSpiral } from "../../../plan-systems/models/classes/archimedean-spiral.class";
import { CartesianCoordinate } from "../../../plan-systems/models/classes/cartesian-coordinate.class";

describe('ArchimedeanSpiral', () => {
    const spiral = new ArchimedeanSpiral(100, 8, 2);

    it('cartesian points should be 16 length', () => {
        expect(spiral.getCartesianPoints().length).toEqual(16);
    })

    it('first point should be (0, 0)', () => {
        expect(spiral.getCartesianPoints()[0]).toEqual(new CartesianCoordinate(0, 0));
    })

    it('5th point should be (-100, 0)', () => {
        expect(spiral.getCartesianPoints()[4].isSame(new CartesianCoordinate(-100, 0))).toBeTrue();
    })

    it('9th point should be (+n, 0)', () => {
        expect(spiral.getCartesianPoints()[8].y).toBeLessThan(MINIMUM_ACCEPTABLE_DIFFERENCE);
    })

    it('13th point should be (-300, 0)', () => {
        expect(spiral.getCartesianPoints()[12].isSame(new CartesianCoordinate(-300, 0))).toBeTrue();
    })
});