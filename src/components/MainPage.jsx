// @ts-check
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Modal from './Modal.jsx';
import { actions } from '../slices/index.js';
import routes from '../routes.js';
import getAuthToken from '../lib/auth.js';

const Kickstarter = ({
  kickstarter,
  handleRemove,
  handleEdit,
}) => {
  const { t } = useTranslation();

  return (
    <li key={kickstarter.id} className="nav-item">
      <Dropdown as={ButtonGroup} className="d-flex mb-2">
        {kickstarter.title}
        <Dropdown.Toggle split className="flex-grow-0" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleRemove(kickstarter.id)}>{t('kickstarter.remove')}</Dropdown.Item>
          <Dropdown.Item onClick={handleEdit(kickstarter.id)}>{t('kickstarter.edit')}</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );
};

const MainPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(true);
  const history = useHistory();

  const { kickstarters } = useSelector((state) => {
    console.log(state);
    return state.kickstartersInfo;
  });
  // let kickstarters;

  const handleAddKikstarter = () => {
    dispatch(actions.openModal({ type: 'addKikstarter' }));
  };
  const handleRemoveKikstarter = (kickstarterId) => () => {
    dispatch(actions.openModal({ type: 'removeKikstarter', extra: { kickstarterId } }));
  };
  const handleEditKikstarter = (kickstarterId) => () => {
    dispatch(actions.openModal({ type: 'editKikstarter', extra: { kickstarterId } }));
  };

  useEffect(() => {
    // NOTE this removes warning in tests https://github.com/facebook/react/issues/14369
    // eslint-disable-next-line functional/no-let
    let didMount = true;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.kickstartersPath(),
          {
            headers: {
              Authorization: getAuthToken(),
            },
          });
        if (didMount) setFetching(false);
        dispatch(actions.setKickstarters({ kickstarters: data }));
      } catch (err) {
        if (!err.isAxiosError) {
          throw err;
        }

        if (err.response.status === 401) {
          history.push(routes.loginPagePath());
        }
        // TODO: network error to toast
        throw err;
      }
    };

    fetchData();

    return () => { didMount = false; };
  }, [dispatch, history]);

  return fetching
    ? (
      <Spinner animation="grow" role="status" variant="primary">
        <span className="sr-only">{t('loading')}</span>
      </Spinner>
    )
    : (
      <>
        <div className="d-flex mb-2">
          <Button
            type="button"
            variant="link"
            className="ml-auto p-0"
            onClick={handleAddKikstarter}
          >
            {t('mainPage.addKickstarter')}
          </Button>
        </div>
        <Modal />
        <ul className="nav flex-column nav-pills nav-fill">
          {kickstarters.map((kickstarter) => (
            <Kickstarter
              key={kickstarter.id}
              kickstarter={kickstarter}
              handleRemove={handleRemoveKikstarter}
              handleEdit={handleEditKikstarter}
            />
          ))}
        </ul>

      </>
    );
};

export default MainPage;
