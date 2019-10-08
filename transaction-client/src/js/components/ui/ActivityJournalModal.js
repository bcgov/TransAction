import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';

import PageSpinner from './PageSpinner';
import LogActivityForm from '../forms/LogActivityForm';
import { fetchEventUserActivityList, fetchActivityList } from '../../actions';

import * as Constants from '../../Constants';

class ActivityJournalModal extends React.Component {
  state = { loading: true, showLogActivityForm: false, selectedUserActivity: null };

  componentDidMount() {
    const { currentUser, eventId, fetchEventUserActivityList, activityTypes, fetchActivityList } = this.props;

    fetchEventUserActivityList(eventId, currentUser.id)
      .then(() => {
        if (Object.keys(activityTypes).length === 0) return fetchActivityList();
        else Promise.resolve();
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  showEditLogActivityForm = userActivity => {
    const activityHours = Math.floor(userActivity.minutes / 60);
    const activityMinutes = userActivity.minutes % 60;
    const activityTimestamp = moment(userActivity.activityTimestamp).format('YYYY-MM-DD');

    const newUserActivity = { ...userActivity, activityHours, activityMinutes, activityTimestamp };
    this.setState({ showLogActivityForm: true, selectedUserActivity: newUserActivity });
  };

  toggleLogActivityForm = () => {
    this.setState(prevState => ({
      showLogActivityForm: !prevState.showLogActivityForm,
    }));
  };

  renderContent() {
    const { userActivities, activityTypes, eventId, currentUser } = this.props;

    const thisEventUserActivities = Object.values(userActivities).filter(
      o => o.eventId === eventId && o.userId === currentUser.id
    );

    const tableRows = _.orderBy(thisEventUserActivities, ['activityTimestamp'], ['desc']).map(o => (
      <tr key={o.id}>
        <td>{activityTypes[o.activityId].name}</td>
        <td>{activityTypes[o.activityId].intensity}</td>
        <td>{o.description}</td>
        <td className="text-nowrap">{o.minutes}</td>
        <td className="text-nowrap">{moment(o.activityTimestamp).format('YYYY-MM-DD')}</td>
        <td>
          <Button size="sm" color="primary" block onClick={() => this.showEditLogActivityForm(o)}>
            Edit
          </Button>
        </td>
        <td>
          <Button size="sm" color="primary" block>
            Delete
          </Button>
        </td>
      </tr>
    ));

    return (
      <Table size="sm" bordered hover>
        <thead className="thead-dark">
          <tr>
            <th>Activity</th>
            <th>Intensity</th>
            <th>Description</th>
            <th>Duration (minutes)</th>
            <th>Date</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    );
  }

  render() {
    const { isOpen, toggle } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
          <ModalHeader toggle={toggle}>Activity Journal</ModalHeader>
          <ModalBody>
            {this.state.loading ? (
              <PageSpinner />
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>{this.renderContent()}</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button size="sm" color="primary" onClick={toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        {this.state.showLogActivityForm && (
          <LogActivityForm
            isOpen={this.state.showLogActivityForm}
            toggle={this.toggleLogActivityForm}
            eventId={this.state.selectedUserActivity.eventId}
            refreshStandings={true}
            initialValues={{ ...this.state.selectedUserActivity }}
            formType={Constants.FORM_TYPE.EDIT}
          />
        )}
      </div>
    );
  }
}

ActivityJournalModal.propTypes = {
  eventId: PropTypes.number.isRequired,
};

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
    userActivities: state.userActivities,
    activityTypes: state.activities,
  };
};

export default connect(
  mapStateToProps,
  { fetchEventUserActivityList, fetchActivityList }
)(ActivityJournalModal);
