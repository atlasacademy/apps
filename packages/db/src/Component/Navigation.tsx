import {Language, Region} from "@atlasacademy/api-connector";
import {faDiscord, faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Button, Col, Container, Dropdown, Modal, Nav, Navbar, NavItem, Row} from "react-bootstrap";
import {withRouter} from "react-router";
import {Link, RouteComponentProps} from "react-router-dom";
import {ReactComponent as JPFlag} from "../Assets/jp.svg";
import {ReactComponent as USFlag} from "../Assets/us.svg";
import Manager from "../Setting/Manager";
import SettingForm from "../Setting/SettingForm";
import {Theme} from "../Setting/Theme";

import "./Navigation.css";

type RouteItem = { route: string, name: string };

const additionalItems: Array<RouteItem> = [
    {route: '/command-codes', name: 'Command Codes'},
    {route: '/mystic-codes', name: 'Mystic Codes'},
    {route: '/items', name: 'Materials'},
    {route: '/events', name: 'Events'},
    {route: '/wars', name: 'Wars'},
];

const searchItems: Array<RouteItem> = [
    {route: '/entities', name: 'Entities'},
    {route: '/skills', name: 'Skills'},
    {route: '/noble-phantasms', name: 'Noble Phantasms'},
    {route: '/funcs', name: 'Functions'},
    {route: '/buffs', name: 'Buffs'},
];

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
                <Navbar id={'navigation'} bg={"dark"} variant={'dark'} expand={"lg"} style={{zIndex: 10}}>
                    <Container fluid="xl">
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
                            {additionalItems.concat(searchItems).map((item, i) => {
                                return (
                                    <Nav key={i} className="d-flex d-lg-none">
                                        <Link to={`/${Manager.region()}${item.route}`} className={'nav-link'}>
                                            <NavItem>{item.name}</NavItem>
                                        </Link>
                                    </Nav>
                                );
                            })}
                            <Nav className="d-none d-lg-flex">
                                <Dropdown className="dropdown-custom-toggle">
                                    <Dropdown.Toggle>
                                        Additional
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="left">
                                        {additionalItems.map((item, i) => {
                                            return (
                                                <Dropdown.Item key={i} as={Link}
                                                               to={`/${Manager.region()}${item.route}`}>
                                                    {item.name}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                            <Nav className="d-none d-lg-flex">
                                <Dropdown className="dropdown-custom-toggle">
                                    <Dropdown.Toggle>
                                        Search
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="left">
                                        {searchItems.map((item, i) => {
                                            return (
                                                <Dropdown.Item key={i} as={Link}
                                                               to={`/${Manager.region()}${item.route}`}>
                                                    {item.name}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                            <Nav>
                                <Link to={`/${Manager.region()}/changes`} className={'nav-link'}>
                                    <NavItem>Changelog</NavItem>
                                </Link>
                            </Nav>
                            <Nav className={'ml-auto icons'}>
                                <Row style={{flexFlow: "nowrap", margin: "0 1px"}}>
                                    <Col style={{padding: 0}}>
                                        <Link
                                            style={{justifyContent: "center", display: "flex", width: "100%"}}
                                            to={this.regionLink(Region.JP)}
                                            className={`nav-link ${this.regionClass(Region.JP)}`}>
                                            <JPFlag
                                                title={'View data from the JP version'}
                                                style={{width: "1.25em", height: "1em"}}
                                            />
                                        </Link>
                                    </Col>
                                    <Col style={{padding: 0}}>
                                        <Link
                                            style={{justifyContent: "center", display: "flex", width: "100%"}}
                                            to={this.regionLink(Region.NA)}
                                            className={`nav-link ${this.regionClass(Region.NA)}`}>
                                            <USFlag
                                                title={'View data from the NA version'}
                                                style={{width: "1.25em", height: "1em"}}
                                            />
                                        </Link>
                                    </Col>
                                </Row>
                                <Row style={{flexFlow: "nowrap", margin: "0 1px"}}>
                                    <Col style={{padding: 0}}>
                                        <Nav.Link style={{justifyContent: "center", display: "flex"}}
                                                  href={'https://discord.gg/TKJmuCR'} target={'_blank'}>
                                            <FontAwesomeIcon icon={faDiscord} title="Atlas Academy Discord"/>
                                        </Nav.Link>
                                    </Col>
                                    <Col style={{padding: 0}}>
                                        <Nav.Link style={{justifyContent: "center", display: "flex"}}
                                                  href={'https://github.com/atlasacademy/apps'} target={'_blank'}>
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
