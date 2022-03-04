import React from 'react';
import { Link } from 'react-router-dom';
import { War, Region } from "@atlasacademy/api-connector";


import './WarMap.css';
interface IProps {
    region: Region
    map: War.Map;
    spots: War.Spot[];
    warName: string;
    warId: number;
}

class WarMap extends React.Component<IProps> {
    render () {
        const renderMap = {...this.props.map};
        const warMapOverrides: { warIds: number[]; [key: number]: {[key: number]: string} } = {
            warIds: [9010],
            9010: {
                9010: 'https://static.atlasacademy.io/NA/Terminal/QuestMap/Capter9010/MGE_901001_00.png',
                9011: 'https://static.atlasacademy.io/NA/Terminal/QuestMap/Capter9010/MGE_901003_00.png',
                9012: 'https://static.atlasacademy.io/NA/Terminal/QuestMap/Capter9010/MGE_901008_00.png',
            },
        };
        if (warMapOverrides.warIds.includes(this.props.warId)) {
            renderMap.mapImage = warMapOverrides[this.props.warId][renderMap.id];
        }
        return (
            <div className='warmap-parent' >
            <div className='warmap-container' >
                <img className='warmap' alt={`${this.props.warName} map`} src={renderMap.mapImage} style={{ aspectRatio: `${renderMap.mapImageW}/${renderMap.mapImageH}` }} />
                { this.props.spots.map((spot) => {
                    let freeQuestId = spot.quests.find((quest) => quest.afterClear === 'repeatLast')!.id;
                    return (spot.x < 99999 && spot.y < 99999) ? (
                    <Link to={`/${this.props.region}/quest/${freeQuestId}`}>
                        <img key={spot.id} alt={spot.name} src={spot.image} className='warspot' style={{ top: `${ 100 * spot.y / renderMap.mapImageH - 3 }%`, left: `${100 * spot.x / renderMap.mapImageW }%` }} />
                    </Link>
                    ) : null;
                })}
            </div>
            </div>
        );
    }
};

export default WarMap;