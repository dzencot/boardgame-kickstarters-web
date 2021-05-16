// @ts-check

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory, Link } from 'react-router-dom';
import useAuth from '../hooks/index.js';
import routes from '../routes.js';

const Login = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(),
          {
            identifier: values.username,
            password: values.password,
          });
        auth.logIn(res.data);
        const { from } = location.state || { from: { pathname: routes.chatPagePath() } };
        history.replace(from);
      } catch (err) {
        if (!err.isAxiosError) {
          throw err;
        }

        if (err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        // TODO: toastify error
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
              <Form.Label htmlFor="username">{t('login.username')}</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.username}
                name="username"
                id="username"
                autoComplete="username"
                isInvalid={authFailed}
                required
                ref={inputRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">{t('login.password')}</Form.Label>
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
                id="password"
                autoComplete="current-password"
                isInvalid={authFailed}
                required
              />
              {authFailed && <Form.Control.Feedback type="invalid">{t('login.authFailed')}</Form.Control.Feedback>}
            </Form.Group>
            <Button type="submit" variant="outline-primary" className="w-100 mb-3">{t('login.submit')}</Button>
            <div className="d-flex flex-column align-items-center">
              <span className="small mb-2">{t('login.newToChat')}</span>
              {' '}
              <Link to="/signup">{t('login.signup')}</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
