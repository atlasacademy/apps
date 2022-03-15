import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { Region } from "@atlasacademy/api-connector";
import { BgmEntity } from "@atlasacademy/api-connector/dist/Schema/Bgm";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api, { Host } from "../Api";
import DataTable from "../Component/DataTable";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import RawDataViewer from "../Component/RawDataViewer";
import BgmDescriptor, { getBgmName } from "../Descriptor/BgmDescriptor";
import ItemDescriptor from "../Descriptor/ItemDescriptor";
import { QuestDescriptorId } from "../Descriptor/QuestDescriptor";
import QuestSearchDescriptor from "../Descriptor/QuestSearchDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";

import "../Helper/StringHelper.css";

const BgmPage = (props: { region: Region; bgmId: number }) => {
    const { region, bgmId } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [bgm, setBgm] = useState<BgmEntity | undefined>(undefined);

    useEffect(() => {
        Manager.setRegion(region);
        Api.bgm(bgmId)
            .then((bgm) => {
                setBgm(bgm);
                setLoading(false);
            })
            .catch((e) => setError(e));
    }, [region, bgmId]);

    if (loading) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    if (bgm === undefined) return null;

    const showName = getBgmName(bgm);

    document.title = `[${region}] BGM ${showName} - Atlas Academy DB`;

    const shopDetail = bgm.shop ? (
        <>
            <ItemDescriptor region={region} item={bgm.shop.cost.item} /> x{bgm.shop.cost.amount}
        </>
    ) : (
        ""
    );
    const bgmRelease = (
        <>
            {mergeElements(
                bgm.releaseConditions.map((release) => (
                    <div key={release.id}>
                        {release.closedMessage !== "" ? `${release.closedMessage} — ` : ""}
                        Cleared{" "}
                        {mergeElements(
                            release.targetIds.map((questId) => (
                                <QuestDescriptorId
                                    key={questId}
                                    text=""
                                    region={region}
                                    questId={questId}
                                    questPhase={1}
                                />
                            )),
                            " or "
                        )}
                    </div>
                )),
                <br />
            )}
        </>
    );

    return (
        <>
            <h1>
                <img src={bgm.logo} style={{ height: "1.5em" }} alt="BGM Logo" />
                <span className="newline">{showName}</span>
            </h1>
            <DataTable
                data={{
                    ID: bgm.id,
                    Name: <span className="newline">{showName}</span>,
                    "Available to Buy": toTitleCase((!bgm.notReleased).toString()),
                    Player: <BgmDescriptor region={region} bgm={bgm} showName="Download" />,
                    "Unlock Condition": bgmRelease,
                    "Unlock Cost": shopDetail,
                    Quests: <QuestSearchDescriptor region={region} bgmId={bgm.id} />,
                    Raw: (
                        <Row>
                            <Col>
                                <RawDataViewer text="Nice" data={bgm} />
                            </Col>
                            <Col>
                                <RawDataViewer text="Raw" data={`${Host}/raw/${props.region}/bgm/${bgm.id}`} />
                            </Col>
                        </Row>
                    ),
                }}
            />
        </>
    );
};

export default BgmPage;
