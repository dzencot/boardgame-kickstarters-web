// @ts-check

import React from 'react';
import {
  Modal as BootstrapModal,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import getLogger from '../../lib/logger.js';
import { actions } from '../../slices/index.js';

import AddKikstarterForm from '../forms/AddKickstarterForm.jsx';
import RemoveKikstarterForm from '../forms/RemoveKickstarterForm.jsx';
import EditKikstarterForm from '../forms/EditKickstarterForm.jsx';
import AddContractForm from '../forms/AddContractForm.jsx';
import AddPledgeForm from '../forms/AddPledgeForm.jsx';

const log = getLogger('modal'); // eslint-disable-line

const mapping = {
  addKikstarter: AddKikstarterForm,
  removeKikstarter: RemoveKikstarterForm,
  renameKikstarter: EditKikstarterForm,
  addContract: AddContractForm,
  addPledge: AddPledgeForm,
};

const Modal = () => {
  const dispatch = useDispatch();
  const isOpened = useSelector((state) => state.modal.isOpened);

  const handleClose = () => {
    dispatch(actions.closeModal());
  };
  const modalType = useSelector((state) => state.modal.type);

  const Component = mapping[modalType];

  return (
    <BootstrapModal show={isOpened} onHide={handleClose}>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;
