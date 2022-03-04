import React from 'react';
//import { RouteComponentProps } from 'react-router-dom';
import { War, Region } from "@atlasacademy/api-connector";
//import fetch from 'node-fetch';

import './WarMap.css';
import { Link } from 'react-router-dom';

interface IProps {
    region: Region
    map: War.Map;
    spots: War.Spot[];
    warName: string;
}

//todo dropdown toggle
class WarMap extends React.Component<IProps> {
    render() {

        return (
            <div className='warmap-parent' >
            <div className='warmap-container'><img className='warmap' alt={`${this.props.warName} map`} src={this.props.map.mapImage} style={{ aspectRatio: `${this.props.map.mapImageW}/${this.props.map.mapImageH}` }} />
            { this.props.spots.map((spot) => {
                let freeQuestId = spot.quests.find((quest) => quest.afterClear === 'repeatLast')!.id;
                return (
                <Link to={`/${this.props.region}/quest/${freeQuestId}`}>
                    <img key={spot.id} alt={spot.name} src={spot.image} className='warspot' style={{ top: `${ 100 * spot.y / this.props.map.mapImageH - 10 }%`, left: `${100 * spot.x / this.props.map.mapImageW }%` }} />
                </Link>
            )})}
            </div>
            </div>
        );
    }
};

export default WarMap;