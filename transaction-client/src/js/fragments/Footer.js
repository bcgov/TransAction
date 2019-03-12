import React, { Component } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavItem, NavLink } from 'reactstrap';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Navbar className="navbar navbar-expand-lg navbar-dark">
          <Container>
            <Nav className="navbar-nav">
              <NavItem>
                <NavLink tag={RRNavLink} to="#">
                  Disclaimer
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="#">
                  Privacy
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="#">
                  Accessibility
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="#">
                  Copyright
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="#">
                  Contact Us
                </NavLink>
              </NavItem>
            </Nav>
          </Container>
        </Navbar>
      </footer>
    );
  }
}

export default Footer;
