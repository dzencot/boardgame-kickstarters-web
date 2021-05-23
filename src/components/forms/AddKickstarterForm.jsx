// @ts-check

import React, { useRef, useEffect } from 'react';
import {
  Modal as BootstrapModal,
  Form,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import getLogger from '../../lib/logger.js';
import { actions } from '../../slices/index.js';
import routes from '../../routes.js';
import { getFetch } from '../../lib/utils.js';

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

const AddKikstarterForm = ({ handleClose }) => {
  const kickstarters = [];
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const f = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getValidationSchema(kickstarters),
    onSubmit: async ({ name }, { setSubmitting }) => {
      const kickstarter = { title: name };
      try {
        const { data } = await getFetch().post(routes.kickstartersPath(), kickstarter);
        log('kickstarter.create', data);
        dispatch(actions.addKickstarter({ kickstarter: data }));
        handleClose();
      } catch (e) {
        console.log('kickstarter errr', e);
        log('kickstarter.create.error', e);
        setSubmitting(false);
        inputRef.current.select();
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{t('modals.addKickstarter')}</BootstrapModal.Title>
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
              data-testid="add-kickstarter"
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

export default AddKikstarterForm;