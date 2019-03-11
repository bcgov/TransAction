import React, { Component } from 'react';
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import { Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

class Header extends Component {
  state = { collapsed: true };

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <header>
        <Navbar className="navbar navbar-expand-lg navbar-dark">
          <Container>
            <NavbarBrand tag={Link} to="/">
              <img
                className="img-fluid d-none d-md-block"
                src="/images/bcid-logo-rev-en.svg"
                width="181"
                height="44"
                alt="B.C. Government Logo"
              />
              <img
                className="img-fluid d-md-none"
                src="/images/bcid-symbol-rev.svg"
                width="64"
                height="44"
                alt="B.C. Government Logo"
              />
            </NavbarBrand>
            <div className="navbar-brand">Transaction</div>
            <NavbarToggler onClick={this.toggleNavbar} />
            <Collapse isOpen={!this.state.collapsed} navbar>
              <Nav className="navbar-nav">
                <NavItem>
                  <NavLink tag={RRNavLink} to="/">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/events">
                    Events
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

export default Header;
