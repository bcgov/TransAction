import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'reactstrap';
import _ from 'lodash';

import CardWrapper from './ui/CardWrapper';
import { fetchActivityList, deleteActivityType } from '../actions';
import DialogModal from './ui/DialogModal';
import EditActivityTypeForm from './forms/EditActivityTypeForm';

import * as Constants from '../Constants';
import * as api from '../api/api';

const AdminActivity = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogOptions, setConfirmDialogOptions] = useState({});
  const [showEditActivityTypeForm, setShowEditActivityTypeForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(undefined);
  const [editActivityTypeFormType, setEditActivityTypeFormType] = useState(Constants.FORM_TYPE.EDIT);

  const dispatch = useDispatch();
  const activities = useSelector((state) => Object.values(state.activities));

  useEffect(() => {
    api.resetCancelTokenSource();
    dispatch(fetchActivityList());

    return () => {
      api.cancelRequest();
    };
  }, [dispatch]);

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setConfirmDialogOptions({});
  };

  const confirmRemoveActivity = (activity) => {
    setShowConfirmDialog(true);
    setConfirmDialogOptions({
      title: 'Remove Activity Type?',
      body: `${activity.name} will be removed.`,
      secondary: true,
      callback: (confirm) => handleRemoveActivity(confirm, activity.id),
    });
  };

  const handleRemoveActivity = (confirm, id) => {
    if (confirm) {
      dispatch(deleteActivityType(id)).finally(() => closeConfirmDialog());
    } else {
      closeConfirmDialog();
    }
  };

  const showEditActivityTypeFormHandler = (activity, formType) => {
    setSelectedActivity(activity);
    setEditActivityTypeFormType(formType);
    setShowEditActivityTypeForm(true);
  };

  const toggleEditActivityTypeForm = () => {
    setShowEditActivityTypeForm((prev) => !prev);
  };

  const renderActivityList = () => {
    const activityTableRows = _.orderBy(activities, ['intensity', 'name']).map((o) => (
      <tr key={o.id}>
        <td>{o.name}</td>
        <td>{o.description}</td>
        <td>{o.intensity}</td>
        <td style={{ width: '1%' }}>
          <Button
            size="sm"
            color="primary"
            className="mr-2"
            onClick={() => showEditActivityTypeFormHandler(o, Constants.FORM_TYPE.EDIT)}
          >
            Edit
          </Button>
        </td>
        <td style={{ width: '1%' }}>
          <Button size="sm" color="primary" onClick={() => confirmRemoveActivity(o)}>
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
            <th>Description</th>
            <th>Intensity</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{activityTableRows}</tbody>
      </Table>
    );
  };

  return (
    <React.Fragment>
      <CardWrapper>
        <h4>Activity List Management</h4>
        <Button
          size="sm"
          color="primary"
          className="float-right mb-2"
          onClick={() => showEditActivityTypeFormHandler({ name: '', description: '', intensity: 1 }, Constants.FORM_TYPE.ADD)}
        >
          New Activity Type
        </Button>
        {renderActivityList()}
      </CardWrapper>

      {showConfirmDialog && (
        <DialogModal isOpen={showConfirmDialog} options={confirmDialogOptions} />
      )}

      {showEditActivityTypeForm && (
        <EditActivityTypeForm
          isOpen={showEditActivityTypeForm}
          toggle={toggleEditActivityTypeForm}
          initialValues={selectedActivity}
          formType={editActivityTypeFormType}
        />
      )}
    </React.Fragment>
  );
};

export default AdminActivity;
