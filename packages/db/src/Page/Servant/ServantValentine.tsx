import { Region, Servant } from "@atlasacademy/api-connector";

import CraftEssenceReferenceDescriptor from "../../Descriptor/CraftEssenceReferenceDescriptor";
import ScriptDescriptor from "../../Descriptor/ScriptDescriptor";

const ServantValentine = (props: { region: Region; servant: Servant.Servant }) => {
    const { region, servant } = props;
    if (servant.valentineEquip.length === 0) return null;

    return (
        <>
            <h3>Valentine Craft Essence</h3>
            <ul>
                {servant.valentineEquip.map((equipId, i) => {
                    const scriptInfo = servant.valentineScript[i],
                        scriptLink =
                            scriptInfo === undefined ? null : (
                                <>
                                    {" Script: "}
                                    <ScriptDescriptor
                                        region={region}
                                        scriptId={scriptInfo.scriptId}
                                        scriptName={scriptInfo.scriptName}
                                        scriptType=""
                                    />
                                </>
                            );
                    return (
                        <li key={equipId}>
                            <CraftEssenceReferenceDescriptor region={region} id={equipId} />
                            {scriptLink}
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default ServantValentine;
