// @ts-check

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import useAuth from '../hooks/index.js';
import routes from '../routes.js';

const Registration = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const inputRef = useRef();
  const history = useHistory();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = yup.object().shape({
    // TODO: rewrite to setLocale
    username: yup
      .string()
      .trim()
      .required('signup.required')
      .min(3, 'signup.usernameConstraints')
      .max(20, 'signup.usernameConstraints'),
    password: yup
      .string()
      .trim()
      .required('signup.required')
      .min(6, 'signup.passMin'),
    confirmPassword: yup
      .string()
      .test('confirmPassword', 'signup.mustMatch', (value, context) => value === context.parent.password),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setRegistrationFailed(false);

      try {
        const res = await axios.post(
          routes.signupPath(),
          { username: values.username, email: values.username, password: values.password },
        );
        auth.logIn(res.data);
        history.push(routes.mainPagePath());
      } catch (err) {
        if (!err.isAxiosError) {
          throw err;
        }

        if (err.response.status === 409) {
          setRegistrationFailed(true);
          inputRef.current.select();
          return;
        }

        throw err;
      }
    },
  });

  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Form onSubmit={formik.handleSubmit} className="p-3">
            <Form.Group>
              <Form.Label htmlFor="username">{t('signup.username')}</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder={t('signup.usernameConstraints')}
                name="username"
                id="username"
                autoComplete="username"
                isInvalid={
                  (formik.errors.username && formik.touched.username)
                  || registrationFailed
                }
                required
                ref={inputRef}
              />
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.username)}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">{t('signup.password')}</Form.Label>
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder={t('signup.passMin')}
                name="password"
                id="password"
                isInvalid={
                  (formik.errors.password && formik.touched.password)
                  || registrationFailed
                }
                required
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.password)}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="confirmPassword">{t('signup.confirm')}</Form.Label>
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                placeholder={t('signup.mustMatch')}
                name="confirmPassword"
                id="confirmPassword"
                isInvalid={
                  (formik.errors.confirmPassword && formik.touched.confirmPassword)
                  || registrationFailed
                }
                required
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {registrationFailed
                  ? t('signup.alreadyExists')
                  : t(formik.errors.confirmPassword)}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="outline-primary" className="w-100">{t('signup.submit')}</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
