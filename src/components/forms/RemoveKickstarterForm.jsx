// @ts-check

import React, { useState } from 'react';
import {
  Modal as BootstrapModal,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import getLogger from '../../lib/logger.js';
import routes from '../../routes.js';

const log = getLogger('client');

const RemoveKikstarterForm = ({ handleClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const kickstarterId = '';
  const handleRemove = async () => {
    setLoading(true);
    try {
      log('kickstarter.delete');
      await axios.delete(`${routes.addKikstartersPath()}/${kickstarterId}`);
      handleClose();
    } catch (e) {
      log('kickstarter.remove.error', e);
      setLoading(false);
    }
  };

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{t('modals.remove')}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {t('modals.confirmation')}
        <div className="d-flex justify-content-between">
          <Button
            className="mr-2"
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={handleRemove}
            disabled={loading}
          >
            {t('modals.confirm')}
          </Button>
        </div>
      </BootstrapModal.Body>
    </>
  );
};

export default RemoveKikstarterForm;
