import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Container, Modal, Nav, Navbar, NavItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import React from "react";
import SettingForm from "../Setting/SettingForm";

interface IState {
    showSettings: boolean;
}

class Navigation extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            showSettings: false,
        };
    }

    hideSettings() {
        this.setState({showSettings: false});
    }

    showSettings() {
        this.setState({showSettings: true});
    }

    render() {
        return (
            <div>
                <Navbar bg={"dark"} expand={"lg"}>
                    <Container>
                        <Navbar.Brand>
                            <Link to="/">AA-DB</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle/>

                        <Navbar.Collapse>
                            <Nav>
                                <Link to="/servants">
                                    <NavItem>Servants</NavItem>
                                </Link>
                            </Nav>
                            <Nav className={'ml-auto'}>
                                <Button variant={"primary"} onClick={() => this.showSettings()}>
                                    <FontAwesomeIcon icon={faCog}/>
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Modal show={this.state.showSettings} onHide={() => this.hideSettings()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SettingForm/>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }

}

export default Navigation;
