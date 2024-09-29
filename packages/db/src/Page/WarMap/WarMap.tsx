import React, { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Region, War } from "@atlasacademy/api-connector";

import { AssetHost } from "../../Api";
import ButtonGrid from "../../Component/ButtonGrid";

import "./WarMap.css";

interface IProps {
    region: Region;
    map: War.Map;
    spots: War.Spot[];
    allSpots: War.Spot[];
    warName: string;
    warId: number;
    isEvent: boolean;
    spotRoads: War.SpotRoad[];
}

interface IState {
    showFQSpots: boolean;
    showNonFQSpots: boolean;
    spots: War.Spot[];
    isMapLoaded: boolean;
    mapGimmicks: War.MapGimmick[];
    disabledMapGimmickIds: number[];
    OGMapGimmicks: War.MapGimmick[];
    showRoads: boolean;
}

const doNotGimmicks: number[] = [9056, 9080, 9136];

const donotSpotroad = [306, 9091, 9113];

const WarSpot = ({
    map,
    region,
    spot,
    FQSpotsOnly,
}: {
    map: War.Map;
    region: Region;
    spot: War.Spot;
    FQSpotsOnly: boolean;
}) => {
    const firstQuest = FQSpotsOnly ? spot.quests.find((quest) => quest.afterClear === "repeatLast") : spot.quests[0];

    const spotElement = (
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
    );

    if (firstQuest) {
        return spot.x < map.mapImageW && spot.y < map.mapImageH ? (
            <Link to={`/${region}/quest/${firstQuest.id}/${Math.max(...firstQuest.phases)}`}>{spotElement}</Link>
        ) : null;
    }

    return spot.x < map.mapImageW && spot.y < map.mapImageH ? spotElement : null;
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
    defaultToggleEnabled: boolean;

    constructor(props: IProps) {
        super(props);

        this.mapImage = this.props.map.mapImage ?? "";
        this.overrideMap(this.props.map.id);

        let mapGimmicks = [...this.props.map.mapGimmicks];

        if (this.props.warId === 306) {
            mapGimmicks = mapGimmicks.slice(0, mapGimmicks.length - 3);
        }

        const OGMapGimmicks = [...mapGimmicks];

        this.defaultToggleEnabled = mapGimmicks.length <= 25;

        this.state = {
            isMapLoaded: true,
            mapGimmicks: this.defaultToggleEnabled ? mapGimmicks : [],
            disabledMapGimmickIds: [],
            OGMapGimmicks,
            showFQSpots: true,
            showNonFQSpots: false,
            spots: this.props.allSpots,
            showRoads:
                !donotSpotroad.includes(this.props.warId) &&
                !!this.props.spotRoads.length &&
                !this.props.isEvent &&
                this.props.warId < 400,
        };
    }

    overrideMap(mapId: number) {
        switch (mapId) {
            case 9010:
            case 9053:
            case 9088:
                this.mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9010/MGE_901001_00.png`;
                break;

            case 9011:
            case 9054:
            case 9089:
                this.mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9010/MGE_901003_00.png`;
                break;

            case 9012:
            case 9055:
            case 9090:
                this.mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9010/MGE_901008_00.png`;
                break;

            case 9056:
            case 9080:
            case 9136:
                this.mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9056/QMap_Cap9056_9056_Atlas_merged.png`;
                break;

            case 9057:
            case 9081:
            case 9137:
                this.mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9057/QMap_Cap9056_9057_Atlas_merged.png`;
                break;

            case 9058:
            case 9082:
            case 9138:
                this.mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9058/QMap_Cap9056_9058_Atlas_merged.png`;
                break;

            case 9059:
            case 9083:
            case 9139:
                this.mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9059/QMap_Cap9056_9059_Atlas_merged.png`;
                break;

            case 9060:
            case 9084:
            case 9140:
                this.mapImage = `${AssetHost}/${this.props.region}/Terminal/QuestMap/Capter9056_9060/QMap_Cap9056_9060_Atlas_merged.png`;
                break;
        }
    }

    render() {
        const showGimmicks =
            !doNotGimmicks.includes(this.props.warId) && this.state.isMapLoaded && !!this.state.OGMapGimmicks.length;

        const showFQSpotsButton =
            this.props.spots.filter((spot) => !spot.quests.some((quest) => quest.afterClear !== "repeatLast")) && // Only FQ spots are present
            this.state.isMapLoaded;

        const showNonFQSpotsButton =
            this.props.spots.filter((spot) => spot.quests.some((quest) => quest.afterClear !== "repeatLast")) && // Only Non-FQ spots are present
            this.state.isMapLoaded;

        const showRoadsButton = this.props.spotRoads.length && this.state.isMapLoaded;

        const mapImageElement = (
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
                {showGimmicks
                    ? (this.state.mapGimmicks ?? []).map((gimmick) => {
                          if (this.state.OGMapGimmicks.length < 51) {
                              return (
                                  <img
                                      key={gimmick.id}
                                      className="warmap"
                                      alt=""
                                      onError={() =>
                                          this.setState({
                                              disabledMapGimmickIds: [...this.state.disabledMapGimmickIds, gimmick.id],
                                          })
                                      }
                                      src={gimmick.image}
                                  />
                              );
                          }
                          return <img key={gimmick.id} className="warmap" alt="" src={gimmick.image} />;
                      })
                    : []}
            </>
        );

        const gimmickToggles = (
            <ButtonGrid
                itemList={[
                    ...(this.state.OGMapGimmicks ?? []).map((gimmick) => ({
                        uniqueId: gimmick.id,
                        displayName: `${
                            gimmick.id %
                            (this.props.warId * 10 ** (("" + gimmick.id).length - ("" + this.props.warId).length)) // E.g. 913101...913201 => 001...201 for warId 9131
                        }`.padStart(3, "0"),
                    })),
                ]}
                title={"Gimmicks to display"}
                defaultEnabled={this.defaultToggleEnabled}
                disabledItems={this.state.disabledMapGimmickIds}
                onClick={(enabledGimmicks) => {
                    this.setState({
                        mapGimmicks: (this.state.OGMapGimmicks ?? []).filter((gimmick) =>
                            enabledGimmicks.includes(gimmick.id)
                        ),
                    });
                }}
            />
        );

        return (
            <div className="warmap-parent">
                {showGimmicks ? gimmickToggles : []}
                <div className="warmap-container">
                    {this.state.isMapLoaded && this.props.spots.length
                        ? [
                              ...this.props.spots.filter((spot) =>
                                  this.state.showFQSpots
                                      ? spot.quests.some((quest) => quest.afterClear === "repeatLast")
                                      : false
                              ),
                              ...this.props.spots.filter((spot) =>
                                  this.state.showNonFQSpots
                                      ? spot.quests.every((quest) => quest.afterClear !== "repeatLast")
                                      : false
                              ),
                          ].map((spot) => (
                              <WarSpot
                                  key={spot.id}
                                  map={this.props.map}
                                  region={this.props.region}
                                  spot={spot}
                                  FQSpotsOnly={this.state.showFQSpots}
                              />
                          ))
                        : null}
                    {this.state.showRoads ? (
                        <SpotRoads
                            map={this.props.map}
                            spotRoads={this.props.spotRoads}
                            spots={this.props.allSpots}
                            warId={this.props.warId}
                        />
                    ) : (
                        []
                    )}
                    {this.state.isMapLoaded ? mapImageElement : <p>Map unavailable for this war.</p>}
                </div>
                {this.props.spots.length ? (
                    <div id="spot-button-container">
                        {showFQSpotsButton ? (
                            <Button
                                className="toggle-all-spots"
                                variant={this.state.showFQSpots ? "success" : "secondary"}
                                onClick={() => this.setState({ showFQSpots: !this.state.showFQSpots })}
                            >
                                FQ Spots
                            </Button>
                        ) : (
                            []
                        )}
                        {showNonFQSpotsButton ? (
                            <Button
                                className="toggle-spots"
                                variant={this.state.showNonFQSpots ? "success" : "secondary"}
                                onClick={() => this.setState({ showNonFQSpots: !this.state.showNonFQSpots })}
                            >
                                Non-FQ Spots
                            </Button>
                        ) : (
                            []
                        )}
                        {showRoadsButton ? (
                            <Button
                                className="toggle-spots"
                                variant={this.state.showRoads ? "success" : "secondary"}
                                onClick={() => this.setState({ showRoads: !this.state.showRoads })}
                            >
                                Roads
                            </Button>
                        ) : (
                            []
                        )}
                    </div>
                ) : (
                    []
                )}
            </div>
        );
    }
}

export default WarMap;
