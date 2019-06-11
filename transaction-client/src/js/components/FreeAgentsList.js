import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';

import { fetchUsers } from '../actions';
import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

class FreeAgentsList extends Component {
  state = { loading: true, clickable: true };

  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  componentDidMount() {
    this.props
      .fetchUsers()
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(e => {
        console.error(e);
      });
  }

  renderContent() {
    const { regions, users } = this.props;
    const userRows = Object.values(users)
      .filter(user => user.isFreeAgent && !user.teamId)
      .map(user => (
        <tr key={user.id}>
          <td>{user.fname}</td>
          <td>{user.lname}</td>
          <td>{regions[user.regionId].name}</td>
          <td>
            <Button color="primary" size="sm">
              Recruit
            </Button>
          </td>
        </tr>
      ));

    return (
      <Table size="sm" hover bordered responsive className="mt-3">
        <thead className="thead-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Region</th>
            <th />
          </tr>
        </thead>
        <tbody>{userRows}</tbody>
      </Table>
    );
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>{[{ active: true, text: 'Free Agents' }]}</BreadcrumbFragment>
        <CardWrapper>
          <h4>Free Agents</h4>
          <p>
            Team leaders can recruit from TransAction <em>Free Agents</em> below.
          </p>
          {this.state.loading ? <PageSpinner /> : this.renderContent()}
        </CardWrapper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.users.all,
    regions: state.regions,
  };
};
export default connect(
  mapStateToProps,
  { fetchUsers }
)(FreeAgentsList);
