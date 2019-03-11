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
                <NavLink tag={RRNavLink} to="https://www2.gov.bc.ca/gov/content/home/disclaimer">
                  Disclaimer
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="https://www2.gov.bc.ca/gov/content/home/privacy">
                  Privacy
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="https://www2.gov.bc.ca/gov/content/home/accessibility">
                  Accessibility
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="https://www2.gov.bc.ca/gov/content/home/copyright">
                  Copyright
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="https://www2.gov.bc.ca/gov/content/home/contact-us">
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
