const getLoadingScreenClassname = (fading) => `loadingscreen ${fading ? 'fading' : ''}`; 

const LoadingScreen = ({ fading }) => (
    <div className={getLoadingScreenClassname(fading)}>
        <div className="map">

            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">

                <path className='path' id="svg_5" d="m70,403c27,61 4,118 94,114c90,-4 14,-261 128,-281c114,-20 48,229 159,240c111,11 72,-274 153,-289c81,-15 80,40 108,95" opacity="1" stroke="#22a6b3" stroke-linejoin="round" fill="none" mask="url('#mask')"/>

                <mask id="mask">
                    <path className="dashed" fill="none" opacity="1"  stroke="rgba(255, 255, 255, .8)" stroke-linejoin="round" id="svg_5" d="m70,403c27,61 4,118 94,114c90,-4 14,-261 128,-281c114,-20 48,229 159,240c111,11 72,-274 153,-289c81,-15 80,40 108,95"/>
                </mask>
            </svg>

            <div className='tile nature'>
                <p className="playertag you"><span>YOU</span></p>
                <div className="floating shadow">
                    <img className='building' src="img/mill_tiny.png"/>
                    <div className="inner"></div>
                    <div className="border"></div>
                    <div className="bottom"></div>
                </div>
            </div>
            <div className='tile nature'>
                <div className="floating">
                    <div className="inner"></div>
                    <div className="border"></div>
                    <div className="bottom"></div>
                </div>
            </div>
            <div className='tile desert'>
                <div className="floating">
                    <div className="inner"></div>
                    <div className="border"></div>
                    <div className="bottom"></div>
                </div>
            </div>
            <div className='tile desert'>
                <div className="floating">
                    <div className="inner"></div>
                    <div className="border"></div>
                    <div className="bottom"></div>
                </div>
            </div>
            <div className='tile desert'>
                <div className="floating">
                    <div className="inner"></div>
                    <div className="border"></div>
                    <div className="bottom"></div>
                </div>
            </div>

            <div className='tile skeletons'>
                <div className="floating">
                    <div className="inner"></div>
                    <div className="border"></div>
                    <div className="bottom"></div>
                </div>
            </div>
            <div className='tile skeletons'>
                <div className="floating">
                    <div className="inner"></div>
                    <div className="border"></div>
                    <div className="bottom"></div>
                </div>
            </div>
            <div className='tile skeletons'>
                <div className="floating shadow">
                    <img className='building' src="img/castle.png"/>
                    <div className="inner"></div>
                    <div className="border"></div>
                    <div className="bottom"></div>
                </div>
                <p className="playertag them"><span>THEM</span></p>
            </div>

        </div>

        <h3 className="loading_label">loading</h3>
   </div>
);

export default LoadingScreen;