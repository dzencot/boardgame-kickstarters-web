// @ts-check

import React, { useRef, useEffect } from 'react';
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

// const getValidationSchema = (kickstarters) => yup.object().shape({
//   name: yup
//     .string()
//     .trim()
//     .required('modals.required')
//     .min(3, 'modals.min')
//     .max(20, 'modals.max')
//     .notOneOf(kickstarters, 'modals.uniq'),
// });

const AddPledgeForm = (props) => {
  const { handleClose } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { kickstarter } = useSelector((state) => state.modal.extra);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const f = useFormik({
    initialValues: {
      name: '',
      price: 0,
    },
    // validationSchema: getValidationSchema(pledge),
    onSubmit: async ({ name, price }, { setSubmitting }) => {
      try {
        log('pledge.add');
        const pledgeData = { title: name, kickstarter: kickstarter.id, price };
        const { data } = await getFetch().post(routes.pledgesPath(), pledgeData);
        dispatch(actions.addPledge({ pledge: data, price }));
        handleClose();
      } catch (e) {
        log('pledge.add.error', e);
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
        <BootstrapModal.Title>{t('modals.pledge.add')}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Control
              as="textarea"
              className="mb-2"
              disabled={f.isSubmitting}
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              isInvalid={f.errors.name && f.touched.name}
              name="name"
            />
            <Form.Control
              type="number"
              className="mb-2"
              disabled={f.isSubmitting}
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.price}
              isInvalid={f.errors.price && f.touched.price}
              name="price"
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

export default AddPledgeForm;
