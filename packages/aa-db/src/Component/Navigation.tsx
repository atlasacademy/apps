import {faDiscord, faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Button, Container, Modal, Nav, Navbar, NavItem} from "react-bootstrap";
import {withRouter} from "react-router";
import {Link, RouteComponentProps} from "react-router-dom";
import Region from "../Api/Data/Region";
import SettingForm from "../Setting/SettingForm";

import "./Navigation.css";

interface IProps extends RouteComponentProps {
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

    private region(): Region {
        const {pathname} = this.props.location,
            matches = pathname.match(/^\/(JP|NA)(?:\/|$)/),
            region = matches ? matches[1] : 'JP';

        return region === 'NA' ? Region.NA : Region.JP;
    }

    private regionClass(region: Region): string {
        return 'flag '
            + (this.region() === region ? '' : 'inactive');
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
                    <Container>
                        <Link to="/" className={'navbar-brand'}>AA-DB</Link>
                        <Navbar.Toggle/>

                        <Navbar.Collapse>
                            <Nav>
                                <Link to={`/${this.region()}/servants`} className={'nav-link'}>
                                    <NavItem>Servants</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${this.region()}/craft-essences`} className={'nav-link'}>
                                    <NavItem>Craft Essences</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${this.region()}/mystic-codes`} className={'nav-link'}>
                                    <NavItem>Mystic Codes</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${this.region()}/buffs`} className={'nav-link'}>
                                    <NavItem>Buffs</NavItem>
                                </Link>
                            </Nav>
                            <Nav>
                                <Link to={`/${this.region()}/funcs`} className={'nav-link'}>
                                    <NavItem>Functions</NavItem>
                                </Link>
                            </Nav>
                            <Nav className={'ml-auto icons'}>
                                <Link to={this.regionLink(Region.JP)}
                                      className={`nav-link ${this.regionClass(Region.JP)}`}>
                                    <img alt={''} src={'assets/jp.svg'}/>
                                </Link>
                                <Link to={this.regionLink(Region.NA)}
                                      className={`nav-link ${this.regionClass(Region.NA)}`}>
                                    <img alt={''} src={'assets/us.svg'}/>
                                </Link>
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

export default withRouter(Navigation);
