import TileMap from '../../levels/test/map/TileMap';
import Canvas from './Canvas';

const mapTileToColor = (tile) => {
    if (tile.isWater()) return '#34ace0';
    if (tile.isEmpty()) return 'transparent';
    if (tile.isDesert()) return '#ffda79';
    if (tile.isHuman()) return '#40407a'; 
    if (tile.isForest()) return '#33d9b2';
}

// const drawFlag = (ctx, path, { x, z }, { width, height }) => {
//     const image = new Image(width, height);
//     image.src = path;

//     image.onload = function() {
//         ctx.drawImage(this, x, z, width, height);
//     };
// };

const draw = ({ ctx }) => {
    const {
        width,
        height
    } = ctx.canvas;
    const size = TileMap.getSize();
    const tileHeight = height / size;
    const tileWidth = width / size;

    ctx.clearRect(0, 0, width, height)

    for (let _x = 0; _x < size; _x++) {
        for (let _z = 0; _z < size; _z++) {
            const tile = TileMap.getTileAt({ x: _x, z: _z });
            const { x, z } = tile.getPosition();
            // const drawingPosition = {
            //     x: x * tileWidth,
            //     z: z * tileHeight
            // };
            // const size = {
            //     width: tileWidth,
            //     height: tileHeight
            // };

            ctx.fillStyle = mapTileToColor(tile);
            ctx.fillRect(x * tileWidth, z * tileHeight, tileWidth, tileHeight);

            // if (tile.isStartingTile()) {
            //     let flagPath = `/img/${tile.isHuman() ? 'human' : 'forest'}_flag.png`;
            //     drawFlag(ctx, flagPath, drawingPosition, size);
            // }
        }
    }
};

const Map = () => {
    return (
        <div class='map widget'>
           <Canvas
            draw={draw}
            width={160}
            height={160} />
        </div>
    )
};

export default Map;