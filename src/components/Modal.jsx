// @ts-check

import React, { useRef, useEffect, useState } from 'react';
import {
  Modal as BootstrapModal,
  Form,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import getLogger from '../lib/logger.js';
import { actions } from '../slices/index.js';
import routes from '../routes.js';

import getAuthToken from '../lib/auth.js';

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
        const { data } = await axios({
          method: 'post',
          url: routes.kickstartersPath(),
          data: kickstarter,
          headers: {
            Authorization: getAuthToken(),
          },
        });
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

const mapping = {
  addKikstarter: AddKikstarterForm,
  removeKikstarter: RemoveKikstarterForm,
  renameKikstarter: EditKikstarterForm,
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
