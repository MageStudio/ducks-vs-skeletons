export const getPointAtDistance = (origin, distance, angle) => {
    return {
        x: Math.sin(angle) * distance + origin.x,
        y: origin.y,
        z: Math.cos(angle) * distance + origin.z,
    };
};
