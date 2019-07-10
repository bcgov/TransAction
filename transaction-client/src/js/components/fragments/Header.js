import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import { Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import * as utils from '../../utils';
import * as Constants from '../../Constants';

class Header extends Component {
  state = { collapsed: true };

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  hideNavbar = () => {
    this.setState({
      collapsed: true,
    });
  };

  render() {
    return (
      <header>
        <Navbar expand="lg" className="navbar-dark">
          <Container>
            <NavbarBrand tag={Link} onClick={this.hideNavbar} to="/">
              <img
                className="img-fluid d-none d-md-block"
                src={`${process.env.PUBLIC_URL}/images/bcid-logo-rev-en.svg`}
                width="181"
                height="44"
                alt="B.C. Government Logo"
              />
              <img
                className="img-fluid d-md-none"
                src={`${process.env.PUBLIC_URL}/bcid-symbol-rev.svg`}
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
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to="/">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to={Constants.PATHS.EVENT}>
                    Events
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to={Constants.PATHS.PROFILE}>
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to={Constants.PATHS.TEAM}>
                    Teams
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to={Constants.PATHS.MESSAGES}>
                    Messages
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to={Constants.PATHS.INCENTIVES}>
                    Incentives
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to={Constants.PATHS.FAQ}>
                    FAQ
                  </NavLink>
                </NavItem>
                {utils.isCurrentUserAdmin() && (
                  <NavItem>
                    <NavLink tag={RRNavLink} onClick={this.hideNavbar} to={Constants.PATHS.ADMIN}>
                      Admin
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.users.all,
  };
};

export default connect(
  mapStateToProps,
  null
)(Header);
