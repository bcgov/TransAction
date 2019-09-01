import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';
import _ from 'lodash';

import CardWrapper from './ui/CardWrapper';
import { fetchActivityList, deleteActivityType } from '../actions';
import DialogModal from './ui/DialogModal';
import EditActivityTypeForm from './forms/EditActivityTypeForm';

import * as Constants from '../Constants';

class AdminActivity extends React.Component {
  state = {
    showConfirmDialog: false,
    confirmDialogOptions: {},
    showEditActivityTypeForm: false,
    selectedActivity: undefined,
    editActivityTypeFormType: Constants.FORM_TYPE.EDIT,
  };

  componentDidMount() {
    this.props.fetchActivityList();
  }

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {} });
  }

  confirmRemoveActivity = activity => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Remove Activity Type?',
        body: `${activity.name} will be removed.`,
        secondary: true,
        callback: confirm => this.handleRemoveActivity(confirm, activity.id),
      },
    });
  };

  handleRemoveActivity = (confirm, id) => {
    if (confirm) {
      this.props.deleteActivityType(id).finally(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
    }
  };

  showEditActivityTypeForm = (activity, editActivityTypeFormType) => {
    this.setState({ showEditActivityTypeForm: true, selectedActivity: activity, editActivityTypeFormType });
  };

  toggleEditActivityTypeForm = () => {
    this.setState(prevState => ({
      showEditActivityTypeForm: !prevState.showEditActivityTypeForm,
    }));
  };

  renderActivityList = () => {
    const { activities } = this.props;
    const activityTableRows = _.orderBy(activities, ['intensity', 'name']).map(o => (
      <tr key={o.id}>
        <td>{o.name}</td>
        <td>{o.intensity}</td>
        <td style={{ width: '1%' }}>
          <Button
            size="sm"
            color="primary"
            className="mr-2"
            onClick={() => this.showEditActivityTypeForm(o, Constants.FORM_TYPE.EDIT)}
          >
            Edit
          </Button>
        </td>
        <td style={{ width: '1%' }}>
          <Button size="sm" color="primary" onClick={() => this.confirmRemoveActivity(o)}>
            Remove
          </Button>
        </td>
      </tr>
    ));

    return (
      <Table size="sm" bordered>
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Intensity</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{activityTableRows}</tbody>
      </Table>
    );
  };

  render() {
    return (
      <React.Fragment>
        <CardWrapper>
          <h4>Activity List Management</h4>
          <Button
            size="sm"
            color="primary"
            className="float-right mb-2"
            onClick={() => this.showEditActivityTypeForm(null, Constants.FORM_TYPE.ADD)}
          >
            New Activity Type
          </Button>
          {this.renderActivityList()}
        </CardWrapper>

        {this.state.showConfirmDialog && (
          <DialogModal isOpen={this.state.showConfirmDialog} options={this.state.confirmDialogOptions} />
        )}

        {this.state.showEditActivityTypeForm && (
          <EditActivityTypeForm
            isOpen={this.state.showEditActivityTypeForm}
            toggle={this.toggleEditActivityTypeForm}
            initialValues={this.state.selectedActivity}
            formType={this.state.editActivityTypeFormType}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    activities: Object.values(state.activities),
  };
};

export default connect(
  mapStateToProps,
  { fetchActivityList, deleteActivityType }
)(AdminActivity);
