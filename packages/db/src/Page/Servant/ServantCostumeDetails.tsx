import { Profile } from "@atlasacademy/api-connector";
import { Table } from "react-bootstrap";

const ServantCostumeDetails = (props: {
    costumes?: {
        [key: string]: Profile.CostumeDetail;
    };
}) => {
    if (
        props.costumes !== undefined &&
        Object.values(props.costumes).length > 0
    ) {
        return (
            <>
                <h3>Costumes</h3>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(props.costumes).map((costume) => (
                            <tr key={costume.id}>
                                <th scope="row">
                                    {costume.costumeCollectionNo}
                                </th>
                                <td>{costume.name}</td>
                                <td>{costume.detail}</td>
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
