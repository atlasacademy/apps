import { Alert } from "react-bootstrap";

import { Region, Servant } from "@atlasacademy/api-connector";

import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import { ordinalNumeral } from "../../Helper/StringHelper";

const ServantLimitImage = ({ region, servant }: { region: Region; servant: Servant.Servant }) => {
    if (servant.ascensionImage.length === 0) return <></>;
    return (
        <Alert variant="success">
            Locked ascension image{servant.ascensionImage.length > 1 ? "s" : ""}:
            <ul className="mb-0">
                {servant.ascensionImage.map((limitImage) => (
                    <li key={limitImage.limitCount}>
                        {ordinalNumeral(limitImage.limitCount)} Ascension:{" "}
                        {ordinalNumeral(limitImage.defaultLimitCount)} Ascension is used unless{" "}
                        <CondTargetValueDescriptor
                            region={region}
                            cond={limitImage.condType}
                            target={limitImage.condTargetId}
                            value={limitImage.condNum}
                        />
                    </li>
                ))}
            </ul>
        </Alert>
    );
};

export default ServantLimitImage;
