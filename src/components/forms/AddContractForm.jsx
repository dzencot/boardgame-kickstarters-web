// @ts-check

import React, { useState } from 'react';
import {
  Modal as BootstrapModal,
  Form,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
// import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import axios from 'axios';

import getLogger from '../../lib/logger.js';
import { actions } from '../../slices/index.js';
import routes from '../../routes.js';
import { getFetch } from '../../lib/utils.js';

const log = getLogger('client');

const AddContractForm = (props) => {
  const { handleClose } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { pledge } = useSelector((state) => state.modal.extra);

  const f = useFormik({
    initialValues: {
      name: '',
      price: 0,
    },
    // validationSchema: getValidationSchema(pledge),
    onSubmit: async ({ name, price }, { setSubmitting }) => {
      try {
        log('contract.add');
        const contractData = {};
        const { data } = await getFetch().post(routes.contractsPath(), contractData);
        dispatch(actions.addContract({ pledge: data, price }));
        handleClose();
      } catch (e) {
        log('contract.add.error', e);
        setSubmitting(false);
        if (!e.isAxiosError) {
          throw e;
        }
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{t('modals.contract.add')}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Control.Feedback type="invalid">
              {t(f.errors.name)}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="mr-2"
                variant="secondary"
                type="button"
                onClick={handleClose}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={f.isSubmitting}
              >
                {t('modals.submit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

export default AddContractForm;
