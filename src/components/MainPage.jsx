// @ts-check
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dropdown, ButtonGroup, Image } from 'react-bootstrap';
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

  const previewUrl = `${routes.apiPath()}${kickstarter.preview.url}`;

  return (
    <div key={kickstarter.id} className="d-flex flex-column align-items-center mb-3">
      <div className="p-2">
        <span>{kickstarter.title}</span>
      </div>
      <div className="p-2">
        <Image src={previewUrl} />
      </div>
      <div className="p-2">
        <span>{kickstarter.start_date} - {kickstarter.finish_date}</span>
      </div>
    </div>
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
        <main className="bg-info">
          {kickstarters.map((kickstarter) => (
            <Kickstarter
              key={kickstarter.id}
              kickstarter={kickstarter}
              handleRemove={handleRemoveKikstarter}
              handleEdit={handleEditKikstarter}
            />
          ))}
        </main>
      </>
    );
};

export default MainPage;
