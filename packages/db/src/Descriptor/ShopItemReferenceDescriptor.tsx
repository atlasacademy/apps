import { Item, Region } from "@atlasacademy/api-connector";
import useApi from "../Hooks/useApi";
import EntityReferenceDescriptor from "./EntityReferenceDescriptor";

interface Props {
    shopId: number;
    region: Region;
}

const ShopItemReferenceDescriptor: React.FC<Props> = ({ shopId, region }) => {
    const { loading, data } = useApi("shop", shopId);
    
    if (loading) {
        return <>Loading...</>;
    }

    if (!data) {
        return <>Shop not found</>;
    }

    return (
        <>
            {data.targetIds.map((id) => <EntityReferenceDescriptor key={id} region={region} svtId={id} />)}
        </>
    );
}

export default ShopItemReferenceDescriptor