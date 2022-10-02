export const distance = ({ x, z }, { x: _x, z: _z})  => (
    Math.sqrt(
        Math.pow((_x - x), 2) +
        Math.pow((_z - z), 2)
    )
);