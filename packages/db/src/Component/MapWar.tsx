import { War } from "@atlasacademy/api-connector";
import "./MapWar.css";

const MAP_HIDDEN = [
    30502, // LB 5, map wihtout spot and blue background
]

const CCC = [
    "https://static.atlasacademy.io/NA/Terminal/QuestMap/Capter9010/MGE_901001_00.png",
    "https://static.atlasacademy.io/NA/Terminal/QuestMap/Capter9010/MGE_901003_00.png",
    "https://static.atlasacademy.io/NA/Terminal/QuestMap/Capter9010/MGE_901008_00.png",
]



const DragWarn = () => (
    <div className="map-war-drag visibility">
        Drag the map for better view
    </div>
)

interface RenderSpotsProps {
    spots: War.Spot[];
    mapId: number;
}

const RenderSpots = (props: RenderSpotsProps) => {
    const { spots, mapId } = props;

    const Spot = ({ spot }: { spot: War.Spot }) => (
        <img 
            alt={spot.name} 
            src={spot.image} 
            className="map-war-spot" 
            style={{
                top: spot.y + spot.questOfsY + spot.nameOfsY - 20,
                left: spot.x - spot.questOfsX + spot.nameOfsX - 20,
                zIndex: "2",
            }}
        />
    )
    
    const spotFiltered = spots
        .filter(spot => spot.mapId === mapId && spot.x < 99999 && spot.y < 99999);

    
    const spotsComponents = spotFiltered.map(spot => <Spot key={spot.id} spot={spot} />);


    return (
        <div className="map-war-spots">
            {spotsComponents}
        </div>
    );
};

interface RenderMapProps {
    children: JSX.Element | JSX.Element[];
    image: string | undefined;
    height: number,
    width: number,
}

const RenderMap = (props: RenderMapProps) => {
    const { children, image, height, width } = props;

    return (
        <div className="map-war">
            <img style={{ zoom: 0.534 }} height={height + 'px'} width={width + 'px'} src={image} alt="map" />
            {children}
        </div>
    );
}

interface MapWarProps {
    war: War.War;
}

export default function MapWar({ war }: MapWarProps) {
    

    const mapsFiltered = war.maps.filter((map) => !MAP_HIDDEN.includes(map.id));
    
    const mapsComponents = mapsFiltered.map((map, i) => {        
    
        if(war.id === 9010) {
            map.mapImage = CCC[i];
        }

        return (
            <section key={i}>
                <br />
                <h1> { war.name } - Map #{ map.id } </h1>
                <hr />
                <RenderMap height={map.mapImageH} width={map.mapImageW} image={map.mapImage}>
                    <RenderSpots spots={war.spots} mapId={map.id} />
                    <DragWarn />
                </RenderMap>
            </section>
        )
    })

    return (
        <>
            {mapsComponents}
        </>
    )
}