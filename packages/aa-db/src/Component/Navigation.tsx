import {Nav, Navbar, NavItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import React from "react";

function Navigation() {
    return (
        <Navbar bg="dark">
            <Navbar.Brand>
                <Link to="/">AA-DB</Link>
            </Navbar.Brand>

            <Navbar.Collapse>
                <Nav>
                    <Link to="/servants">
                        <NavItem>Servants</NavItem>
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
