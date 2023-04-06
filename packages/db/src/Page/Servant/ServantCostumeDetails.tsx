import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Profile, Region } from "@atlasacademy/api-connector";

import { FGOText } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

const ServantCostumeDetails = (props: {
    region: Region;
    costumes?: {
        [key: string]: Profile.CostumeDetail;
    };
}) => {
    const { t } = useTranslation();
    if (props.costumes !== undefined && Object.values(props.costumes).length > 0) {
        return (
            <>
                <h3>{t("Costumes")}</h3>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t("Name")}</th>
                            <th>{t("Detail")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(props.costumes).map((costume) => (
                            <tr key={costume.id}>
                                <th scope="row">{costume.costumeCollectionNo}</th>
                                <td className="text-prewrap" lang={lang(props.region)}>
                                    <FGOText text={costume.shortName} />
                                </td>
                                <td className="text-prewrap" lang={lang(props.region)}>
                                    <FGOText text={costume.detail} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        );
    } else {
        return null;
    }
};

export default ServantCostumeDetails;
