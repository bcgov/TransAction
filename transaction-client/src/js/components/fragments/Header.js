import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import { Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

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
        <Navbar className="navbar navbar-expand-lg navbar-dark">
          <Container>
            <NavbarBrand tag={Link} onClick={this.hideNavbar} to="/">
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
            <div className="navbar-brand">
              <img className="mx-2" src="/images/eaf-logo.png" width="44" height="44" alt="EAF Logo" />
              Transaction
            </div>
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
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to="/incentives">
                    Incentives
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} onClick={this.hideNavbar} to="/faq">
                    FAQ
                  </NavLink>
                </NavItem>
                {/* {this.props.currentUser.isAdmin && (
                  <NavItem>
                    <NavLink tag={RRNavLink} onClick={this.hideNavbar} to="/admin">
                      Admin
                    </NavLink>
                  </NavItem>
                )} */}
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
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  null
)(Header);
