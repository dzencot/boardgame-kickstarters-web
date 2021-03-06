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
import { useHistory } from 'react-router-dom';
// import axios from 'axios';

import getLogger from '../../lib/logger.js';
import { actions } from '../../slices/index.js';
import routes from '../../routes.js';
import apiRoutes from '../../apiRoutes.js';
import { getFetch } from '../../lib/utils.js';
import kickService from '../../lib/kickstarters.js';

const log = getLogger('client');
log.enabled = true;

const getValidationSchema = (kickstarters) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('modals.required')
    .min(3, 'modals.min')
    .notOneOf(kickstarters, 'modals.uniq'),
});

const AddKikstarterForm = ({ handleClose }) => {
  const kickstarters = [];
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

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
        // const kickApi = 'https://www.kickstarter.com/discover/advanced';
        // const kickstarterName = kickstarter.title;
        // const kickUrl = new URL(kickApi);
        // kickUrl.searchParams.set('term', kickstarterName);
        // kickUrl.searchParams.set('format', 'json');
        // console.log(`url: ${kickUrl.toString()}`);
        // const { data } = await axios.get(kickUrl.toString());
        // const parsedData = kickService.parseKickstartersJson(data);
        // const addedData = await kickService.uploadKickstarters(parsedData);

        const { data } = await getFetch()
          .post(apiRoutes.kickstartersSearchPath(), kickstarter);
        // const { parsedData, uploadedData } = data;
        // await kickService.uploadResources(parsedData, uploadedData);

        log('kickstarter.create', data);
        dispatch(actions.setFoundedKickstarters({ foundedKickstarters: data }));
        handleClose();
        history.replace({ pathname: `${routes.foundedKickstartersPage()}` });
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
