import React from 'react';

export default (props : { level: number }) => {
    let { level } = props;
    if (1 <= level && level <= 10)
        return <img alt='' src={`assets/img_bondsgage_${level}.png`} />
    else return null;
}