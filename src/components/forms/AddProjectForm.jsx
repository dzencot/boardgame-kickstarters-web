// @ts-check

import React, { useRef, useEffect, useState } from 'react';
import {
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
import routes from '../../apiRoutes.js';
import { getFetch } from '../../lib/utils.js';
import projectService from '../../lib/projects.js';

const log = getLogger('client');
log.enabled = true;

const getValidationSchema = (projects) => yup.object().shape({
  title: yup
    .string()
    .trim()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max')
    .notOneOf(projects, 'modals.uniq'),
});

const AddProjectForm = ({ handleClose }) => {
  const projects = [];
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const [uploadFile, setUploadFile] = useState();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const fileHandler = (event) => {
    setUploadFile(event.target.files[0]);
  };

  const f = useFormik({
    initialValues: {
      title: '',
      price: 0,
      image: null,
      finishDate: '',
      description: '',
    },
    validationSchema: getValidationSchema(projects),
    onSubmit: async (formData, { setSubmitting }) => {
      const project = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        finishDate: formData.finishDate,
      };
      try {
        const { data } = await getFetch().post(routes.projectPath(), project);
        await projectService.uploadResources(data, uploadFile);

        log('project.create', data);
        dispatch(actions.addProject({ project: data }));
        history.replace({ pathname: `${routes.projectPath()}/${data.id}` });
      } catch (e) {
        log('project.create.error', e);
        setSubmitting(false);
        inputRef.current.select();
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <Form onSubmit={f.handleSubmit} className="col-lg-r col-md-6 col-12">
      <Form.Group>
        <Form.Label>{t('project.addNew.setProjectTitle')}</Form.Label>
        <Form.Control
          className="mb-2"
          disabled={f.isSubmitting}
          ref={inputRef}
          onChange={f.handleChange}
          onBlur={f.handleBlur}
          value={f.values.title}
          isInvalid={f.errors.title && f.touched.title}
          name="title"
          data-testid="add-project"
        />

        <Form.Label>{t('project.addNew.setProjectDescription')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          className="mb-2"
          disabled={f.isSubmitting}
          onChange={f.handleChange}
          onBlur={f.handleBlur}
          value={f.values.description}
          isInvalid={f.errors.description && f.touched.description}
          name="description"
          data-testid="add-project"
        />

        <Form.Label>{t('project.addNew.setProjectPrice')}</Form.Label>
        <Form.Control
          type="number"
          className="mb-2"
          disabled={f.isSubmitting}
          onChange={f.handleChange}
          onBlur={f.handleBlur}
          value={f.values.price}
          isInvalid={f.errors.title && f.touched.title}
          name="price"
          data-testid="add-project"
        />

        <Form.Label>{t('project.addNew.setProjectFinishData')}</Form.Label>
        <Form.Control
          type="date"
          className="mb-2"
          disabled={f.isSubmitting}
          onChange={f.handleChange}
          onBlur={f.handleBlur}
          value={f.values.finishDate}
          isInvalid={f.errors.finishDate && f.touched.finishDate}
          name="finishDate"
          data-testid="add-project"
        />

        <Form.Label className="form-label" htmlFor="projectImage">{t('project.addNew.setProjectImage')}</Form.Label>
        <input type="file" className="form-control" id="projectImage" onChange={fileHandler} />

        <Form.Control.Feedback type="invalid">
          {t(f.errors.title)}
        </Form.Control.Feedback>
        <div className="mt-3 d-flex justify-content-end">
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
            className="bg-success"
            disabled={f.isSubmitting}
          >
            {t('modals.submit')}
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
};

export default AddProjectForm;
