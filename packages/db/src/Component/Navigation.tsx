import {Language, Region} from "@atlasacademy/api-connector";
import {faDiscord, faGithub, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Button, Container, Modal, Nav, Navbar, NavItem, Row, Col, Dropdown} from "react-bootstrap";
import {withRouter} from "react-router";
import {Link, RouteComponentProps} from "react-router-dom";
import Manager from "../Setting/Manager";
import SettingForm from "../Setting/SettingForm";
import {Theme} from "../Setting/Theme";
import {ReactComponent as USFlag} from "../Assets/us.svg";
import {ReactComponent as JPFlag} from "../Assets/jp.svg";

import "./Navigation.css";

interface IProps extends RouteComponentProps {
    language: Language;
    theme: Theme;
}

interface IState {
    showSettings: boolean;
}

class Navigation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showSettings: false,
        };
    }

    private hideSettings() {
        this.setState({showSettings: false});
    }

    private regionClass(region: Region): string {
        return 'flag '
            + (Manager.region() === region ? '' : 'inactive');
    }

    private regionLink(region: Region): string {
        const {pathname} = this.props.location,
            matches = pathname.match(/^\/(?:JP|NA)(.*)/);

        return matches
            ? `/${region}${matches[1]}`
            : `/${region}`;
    }

    private showSettings() {
        this.setState({showSettings: true});
    }

    render() {
        return (
            <div>
                <Navbar id={'navigation'} bg={"dark"} variant={'dark'} expand={"lg"}>
                    <Container fluid>
                        <Link to="/" className={'navbar-brand'}>AA-DB</Link>
                        <Navbar.Toggle/>

                        <Navbar.Collapse>
                            <Nav>
                                <Link to={`/${Manager.region()}/servants`} className={'nav-link'}>
                                    <NavItem>Servants</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/craft-essences`} className={'nav-link'}>
                                    <NavItem>Craft Essences</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/command-codes`} className={'nav-link'}>
                                    <NavItem>Command Codes</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/mystic-codes`} className={'nav-link'}>
                                    <NavItem>Mystic Codes</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/items`} className={'nav-link'}>
                                    <NavItem>Materials</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/events`} className={'nav-link'}>
                                    <NavItem>Events</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/wars`} className={'nav-link'}>
                                    <NavItem>Wars</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/bgms`} className={'nav-link'}>
                                    <NavItem>BGMs</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/master-missions`} className={'nav-link'}>
                                    <NavItem>Master Missions</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Dropdown id="dropdown-search">
                                <Dropdown.Toggle>
                                    Search
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="left">
                                    <Dropdown.Item as={Link} to={`/${Manager.region()}/entities`}>Entities</Dropdown.Item>
                                    <Dropdown.Item as={Link} to={`/${Manager.region()}/skills`}>Skills</Dropdown.Item>
                                    <Dropdown.Item as={Link} to={`/${Manager.region()}/noble-phantasms`}>Noble Phantasms</Dropdown.Item>
                                    <Dropdown.Item as={Link} to={`/${Manager.region()}/funcs`}>Functions</Dropdown.Item>
                                    <Dropdown.Item as={Link} to={`/${Manager.region()}/buffs`}>Buffs</Dropdown.Item>
                                    <Dropdown.Item as={Link} to={`/${Manager.region()}/quests`}>Quests</Dropdown.Item>
                                    <Dropdown.Item as={Link} to={`/${Manager.region()}/scripts`}>Scripts</Dropdown.Item>
                                </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/changes`} className={'nav-link'}>
                                    <NavItem>Changelog</NavItem>
                                </Link>
                            </Nav>
                            <Nav className={'ml-auto icons'}>
                                <Row>
                                    <Col>
                                        <Link
                                            to={this.regionLink(Region.JP)}
                                            className={`nav-link ${this.regionClass(Region.JP)}`}>
                                            <JPFlag title='View data from the JP version'/>
                                        </Link>
                                    </Col>
                                    <Col>
                                        <Link
                                            to={this.regionLink(Region.NA)}
                                            className={`nav-link ${this.regionClass(Region.NA)}`}>
                                            <USFlag title='View data from the NA version'/>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Nav.Link href='https://discord.gg/TKJmuCR' target='_blank' rel="noopener">
                                            <FontAwesomeIcon icon={faDiscord} title="Atlas Academy Discord"/>
                                        </Nav.Link>
                                    </Col>
                                    <Col>
                                        <Nav.Link href='https://twitter.com/aacademy_fgo' target='_blank' rel="noopener">
                                            <FontAwesomeIcon icon={faTwitter} title="Atlas Academy Twitter"/>
                                        </Nav.Link>
                                    </Col>
                                    <Col>
                                        <Nav.Link href='https://github.com/atlasacademy/apps' target='_blank' rel="noopener">
                                            <FontAwesomeIcon icon={faGithub} title="Atlas Academy DB Github"/>
                                        </Nav.Link>
                                    </Col>
                                </Row>
                                <Button variant={"primary"} onClick={() => this.showSettings()}>
                                    <FontAwesomeIcon icon={faCog} title="Settings"/>
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
                        <SettingForm
                            language={this.props.language}
                            theme={this.props.theme}/>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }

}

export default withRouter(Navigation);
