import React from "react";

interface IProps {
    id: number;
}

class NoblePhantasmPage extends React.Component<IProps, any> {
    render() {
        return (
            <div>
                Noble Phantasm: {this.props.id}
            </div>
        );
    }
}

export default NoblePhantasmPage;
