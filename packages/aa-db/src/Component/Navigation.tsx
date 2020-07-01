import {faDiscord, faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Button, Container, Modal, Nav, Navbar, NavItem} from "react-bootstrap";
import {Link} from "react-router-dom";
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
                <Navbar bg={"dark"} variant={'dark'} expand={"lg"}>
                    <Container>
                        <Link to="/" className={'navbar-brand'}>AA-DB</Link>
                        <Navbar.Toggle/>

                        <Navbar.Collapse>
                            <Nav>
                                <Link to="/JP/servants" className={'nav-link'}>
                                    <NavItem>JP Servants</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to="/NA/servants" className={'nav-link'}>
                                    <NavItem>NA Servants</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to="/JP/craft-essences" className={'nav-link'}>
                                    <NavItem>JP CE</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to="/NA/craft-essences" className={'nav-link'}>
                                    <NavItem>NA CE</NavItem>
                                </Link>
                            </Nav>
                            <Nav className={'ml-auto'}>
                                <Nav.Link href={'https://discord.gg/TKJmuCR'} target={'_blank'}>
                                    <FontAwesomeIcon icon={faDiscord}/>
                                </Nav.Link>
                                <Nav.Link href={'https://github.com/atlasacademy/aa-db'} target={'_blank'}>
                                    <FontAwesomeIcon icon={faGithub}/>
                                </Nav.Link>
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
