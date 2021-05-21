// @ts-check

import React, { useRef, useEffect } from 'react';
import {
  Modal as BootstrapModal,
  Form,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import getLogger from '../../lib/logger.js';
import routes from '../../routes.js';

const log = getLogger('client');

const getValidationSchema = (kickstarters) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max')
    .notOneOf(kickstarters, 'modals.uniq'),
});

const EditKikstarterForm = ({ handleClose }) => {
  const { t } = useTranslation();
  const kickstarters = [];
  const kickstarter = {};
  const inputRef = useRef(null);
  useEffect(() => {
    setTimeout(() => inputRef.current.select());
  }, []);
  const f = useFormik({
    initialValues: {
      name: kickstarter.name,
    },
    validationSchema: getValidationSchema(kickstarters),
    onSubmit: async ({ name }, { setSubmitting }) => {
      const data = { title: name };

      try {
        log('kickstarter.rename');
        await axios.put(routes.kickstartersPath(), data);
        handleClose();
      } catch (e) {
        log('kickstarter.rename.error', e);
        setSubmitting(false);
        inputRef.current.select();
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
        <BootstrapModal.Title>{t('modals.rename')}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              disabled={f.isSubmitting}
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              isInvalid={f.errors.name && f.touched.name}
              name="name"
            />
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

export default EditKikstarterForm;
