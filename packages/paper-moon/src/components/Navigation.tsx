import React from "react";
import { Navbar } from "react-bootstrap";

class Navigation extends React.Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>Paper-Moon</Navbar.Brand>
            </Navbar>
        );
    }
}

export default Navigation;
