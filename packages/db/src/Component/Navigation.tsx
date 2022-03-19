import { faDiscord, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Container, Modal, Nav, Navbar, Row, Col, NavDropdown } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";

import { Language, Region } from "@atlasacademy/api-connector";

import { ReactComponent as CNFlag } from "../Assets/cn.svg";
import { ReactComponent as JPFlag } from "../Assets/jp.svg";
import { ReactComponent as KRFlag } from "../Assets/kr.svg";
import { ReactComponent as TWFlag } from "../Assets/tw.svg";
import { ReactComponent as USFlag } from "../Assets/us.svg";
import Manager from "../Setting/Manager";
import SettingForm from "../Setting/SettingForm";
import { Theme } from "../Setting/Theme";

import "./Navigation.css";

interface IProps extends RouteComponentProps {
    language: Language;
    theme: Theme;
}

interface IState {
    showSettings: boolean;
}

const NavPage = ({ path, description }: { path: string; description: string }) => {
    const route = `/${Manager.region()}/${path}`;
    return (
        <Nav.Link as={Link} to={route} eventKey={route}>
            {description}
        </Nav.Link>
    );
};

const NavDropdownPage = ({ path, description }: { path: string; description: string }) => {
    const route = `/${Manager.region()}/${path}`;
    return (
        <NavDropdown.Item as={Link} to={route} eventKey={route}>
            {description}
        </NavDropdown.Item>
    );
};

class Navigation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showSettings: false,
        };
    }

    private hideSettings() {
        this.setState({ showSettings: false });
    }

    private regionClass(region: Region): string {
        return "flag " + (Manager.region() === region ? "" : "inactive");
    }

    private regionLink(region: Region): string {
        const { pathname, hash } = this.props.location,
            matches = pathname.match(/^\/(?:JP|NA|CN|KR|TW)(.*)/);

        return matches ? `/${region}${matches[1]}${hash}` : `/${region}${hash}`;
    }

    private showSettings() {
        this.setState({ showSettings: true });
    }

    render() {
        return (
            <>
                <Navbar id={"navigation"} bg={"light"} variant={"light"} expand={"lg"}>
                    <Container fluid>
                        <Navbar.Brand as={Link} to="/" title="Atlas Academy Database">
                            Atlas Academy DB
                        </Navbar.Brand>
                        <Navbar.Toggle />

                        <Navbar.Collapse>
                            <Nav activeKey={this.props.location.pathname}>
                                <NavPage path="servants" description="Servants" />
                                <NavPage path="craft-essences" description="Craft Essences" />
                                <NavPage path="wars" description="Wars" />
                                <NavDropdown title="Other" id="dropdown-other">
                                    <NavDropdownPage path="command-codes" description="Command Codes" />
                                    <NavDropdownPage path="mystic-codes" description="Mystic Codes" />
                                    <NavDropdownPage path="items" description="Materials" />
                                    <NavDropdownPage path="events" description="Events" />
                                    <NavDropdownPage path="bgms" description="BGMs" />
                                    <NavDropdownPage path="master-missions" description="Master Missions" />
                                </NavDropdown>
                                <NavDropdown title="Search" id="dropdown-search">
                                    <NavDropdownPage path="entities" description="Entities" />
                                    <NavDropdownPage path="skills" description="Skills" />
                                    <NavDropdownPage path="noble-phantasms" description="Noble Phantasms" />
                                    <NavDropdownPage path="funcs" description="Functions" />
                                    <NavDropdownPage path="buffs" description="Buffs" />
                                    <NavDropdownPage path="quests" description="Quests" />
                                    <NavDropdownPage path="scripts" description="Scripts" />
                                </NavDropdown>
                                <NavDropdown title="Changelog" id="dropdown-search">
                                    <NavDropdownPage path="changes" description="Master Data" />
                                    <NavDropdownPage path="enemy-changes" description="Enemy Data" />
                                </NavDropdown>
                            </Nav>
                            <Nav className={"ml-auto icons"} activeKey="">
                                <Row>
                                    <Col>
                                        <Link
                                            to={this.regionLink(Region.JP)}
                                            className={`nav-link ${this.regionClass(Region.JP)}`}
                                        >
                                            <JPFlag title="View data from the JP version" />
                                        </Link>
                                    </Col>
                                    <Col>
                                        <Link
                                            to={this.regionLink(Region.NA)}
                                            className={`nav-link ${this.regionClass(Region.NA)}`}
                                        >
                                            <USFlag title="View data from the NA version" />
                                        </Link>
                                    </Col>
                                    <Col>
                                        <Link
                                            to={this.regionLink(Region.CN)}
                                            className={`nav-link ${this.regionClass(Region.CN)}`}
                                        >
                                            <CNFlag title="View data from the CN version" />
                                        </Link>
                                    </Col>
                                    <Col>
                                        <Link
                                            to={this.regionLink(Region.KR)}
                                            className={`nav-link ${this.regionClass(Region.KR)}`}
                                        >
                                            <KRFlag title="View data from the KR version" />
                                        </Link>
                                    </Col>
                                    <Col>
                                        <Link
                                            to={this.regionLink(Region.TW)}
                                            className={`nav-link ${this.regionClass(Region.TW)}`}
                                        >
                                            <TWFlag title="View data from the TW version" />
                                        </Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Nav.Link href="https://discord.gg/TKJmuCR" target="_blank" rel="noreferrer">
                                            <FontAwesomeIcon icon={faDiscord} title="Atlas Academy Discord" />
                                        </Nav.Link>
                                    </Col>
                                    <Col>
                                        <Nav.Link
                                            href="https://twitter.com/aacademy_fgo"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FontAwesomeIcon icon={faTwitter} title="Atlas Academy Twitter" />
                                        </Nav.Link>
                                    </Col>
                                    <Col>
                                        <Nav.Link
                                            href="https://github.com/atlasacademy/apps"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FontAwesomeIcon icon={faGithub} title="Atlas Academy DB Github" />
                                        </Nav.Link>
                                    </Col>
                                </Row>
                                <Button variant={"primary"} onClick={() => this.showSettings()}>
                                    <FontAwesomeIcon icon={faCog} title="Settings" />
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
                        <SettingForm language={this.props.language} theme={this.props.theme} />
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default withRouter(Navigation);
