import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { War, Region } from "@atlasacademy/api-connector";

import { AssetHost } from "../../Api";

import "./WarMap.css";

interface IProps {
    region: Region;
    map: War.Map;
    spots: War.Spot[];
    allSpots: War.Spot[];
    warName: string;
    warId: number;
    spotRoads: War.SpotRoad[];
}

interface IState {
    isMapLoaded?: boolean;
    mapImage?: string;
}

const overrideMaps = [
    9010, 9011, 9012, 9053, 9054, 9088, 9089, 9090, 9056, 9057, 9058, 9059, 9060, 9080, 9081, 9082, 9083, 9084,
];

const drawGimmicks = [306, 9131];

const donotSpotroad = [9091, 9113];

const WarSpot = ({ map, region, spot }: { map: War.Map; region: Region; spot: War.Spot }) => {
    const firstFreeQuest = spot.quests.find((quest) => quest.afterClear === "repeatLast")!;
    return spot.x < 99999 && spot.y < 99999 ? (
        <Link to={`/${region}/quest/${firstFreeQuest.id}/${Math.max(...firstFreeQuest.phases)}`}>
            <figure
                className="warspot-fig"
                style={{
                    top: `${(100 * (spot.y + spot.questOfsY + spot.nameOfsY)) / map.mapImageH + 2}%`,
                    left: `${(100 * (spot.x + spot.questOfsX + spot.nameOfsX)) / map.mapImageW - 2}%`,
                }}
            >
                <img title={spot.name} alt={spot.name} src={spot.image} className="warspot-img" />
                <figcaption className="spot-name"> {spot.name} </figcaption>
            </figure>
        </Link>
    ) : null;
};

const SpotRoads = ({
    spotRoads,
    spots: _spots,
    map,
    warId,
}: {
    spotRoads: War.SpotRoad[];
    spots: War.Spot[];
    map: War.Map;
    warId: number;
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current as unknown as HTMLCanvasElement;
        const context = canvas!.getContext("2d")!;

        context.strokeStyle = "#E98E1B";
        context.lineWidth = 7;

        if (map.id !== 100) {
            context.strokeStyle = "#F2F4F9";
            context.shadowBlur = 7;
            context.shadowColor = "gray";
        }

        const repeatSpots = _spots
            .filter((spot) => spot.mapId === +map.id)
            .filter((spot) => spot.quests.some((quest) => quest.afterClear === "repeatLast"))
            .filter((spot) => spot.x || spot.y);

        const spots = [308].includes(warId) ? repeatSpots : _spots;

        for (const spotRoad of spotRoads) {
            const srcSpot = spots.find((spot) => spot.id === spotRoad.srcSpotId);
            const dstSpot = spots.find((spot) => spot.id === spotRoad.dstSpotId);

            if (!srcSpot || !dstSpot) {
                continue;
            }

            const x1 = (canvas.width * srcSpot.x) / map.mapImageW;
            const y1 = (canvas.height * srcSpot.y) / map.mapImageH;
            const x2 = (canvas.width * dstSpot.x) / map.mapImageW;
            const y2 = (canvas.height * dstSpot.y) / map.mapImageH;

            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
        }
    }, [map.id, map.mapImageH, map.mapImageW, spotRoads, _spots, warId]);

    return (
        <canvas
            key={map.id}
            ref={canvasRef}
            className={"spot-road"}
            style={{
                aspectRatio: `${map.mapImageW}/${map.mapImageH}`,
            }}
            width={1108}
            height={1108 * (map.mapImageH / map.mapImageW)}
        />
    );
};

class WarMap extends React.Component<IProps, IState> {
    mapImage: string;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isMapLoaded: true,
        };
        this.mapImage = this.props.map.mapImage ?? "";
    }
    overrideMap(mapId: number) {
        let mapImage = "";
        switch (mapId) {
            case 9010:
            case 9053:
            case 9088:
                mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9010/MGE_901001_00.png`;
                break;

            case 9011:
            case 9054:
            case 9089:
                mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9010/MGE_901003_00.png`;
                break;

            case 9012:
            case 9055:
            case 9090:
                mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9010/MGE_901008_00.png`;
                break;
            case 9056:
            case 9080:
                mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9056/QMap_Cap9056_9056_Atlas_merged.png`;
                break;

            case 9057:
            case 9081:
                mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9057/QMap_Cap9056_9057_Atlas_merged.png`;
                break;

            case 9058:
            case 9082:
                mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9058/QMap_Cap9056_9058_Atlas_merged.png`;
                break;

            case 9059:
            case 9083:
                mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9059/QMap_Cap9056_9059_Atlas_merged.png`;
                break;

            case 9060:
            case 9084:
                mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9060/QMap_Cap9056_9060_Atlas_merged.png`;
                break;
        }
        this.mapImage = mapImage;
    }
    render() {
        let mapImageElement = <></>,
            mapGimmicks = [...this.props.map.mapGimmicks];
        if (this.props.warId === 306) {
            mapGimmicks = mapGimmicks.slice(0, mapGimmicks.length - 3);
        } else if (this.props.warId === 9131) {
            mapGimmicks = mapGimmicks.filter((gimmick) => ![913107, 913117, 913118, 913228].includes(gimmick.id));
        }
        if (overrideMaps.includes(this.props.map.id)) {
            this.overrideMap(this.props.map.id);
        }
        mapImageElement = (
            <>
                <img
                    className="warmap"
                    alt={`${this.props.warName} map ${this.props.map.id}`}
                    src={this.mapImage}
                    onError={() => {
                        this.setState({ isMapLoaded: false });
                    }}
                    style={{
                        aspectRatio: `${this.props.map.mapImageW}/${this.props.map.mapImageH}`,
                        position: "relative",
                    }}
                />
                {drawGimmicks.includes(this.props.warId)
                    ? mapGimmicks.map((gimmick) => {
                          return <img key={gimmick.id} className="warmap" alt="" src={gimmick.image} />;
                      })
                    : []}
            </>
        );
        return (
            <div className="warmap-parent">
                <div className="warmap-container">
                    {this.state.isMapLoaded
                        ? this.props.spots.map((spot) => (
                              <WarSpot key={spot.id} map={this.props.map} region={this.props.region} spot={spot} />
                          ))
                        : null}
                    {this.state.isMapLoaded && !donotSpotroad.includes(this.props.warId) ? (
                        <SpotRoads
                            map={this.props.map}
                            spotRoads={this.props.spotRoads}
                            spots={this.props.allSpots}
                            warId={this.props.warId}
                        />
                    ) : null}
                    {this.state.isMapLoaded ? mapImageElement : <p>Map unavailable for this war.</p>}
                </div>
            </div>
        );
    }
}

export default WarMap;
