// @ts-check
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Image } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Modal from './Modal.jsx';
import { actions } from '../slices/index.js';
import routes from '../routes.js';
import getAuthToken from '../lib/auth.js';
import kickService from '../lib/kickstarters.js';

const Kickstarter = ({
  kickstarter,
}) => {
  // const { t } = useTranslation();

  const previewUrl = `${routes.apiPath()}${kickstarter.image_med.url}`;

  return (
    <div key={kickstarter.id} className="col-lg-4 col-md-6 col-12 mt-3">
      <div className="card shadow-sm x-shadow-fade-in h-100">
        <div className="card-header text-white py-2 bg-success text-truncate">
          <h5>{kickstarter.title}</h5>
        </div>
        <div className="d-flex">
          <div className="p-2">
            <Image src={previewUrl} />
          </div>
          <div>
            <span>INFO</span>
          </div>
        </div>
        <div className="d-flex pb-2">
          <div className="pl-2">
            <span>
              {kickstarter.start_date}
              -
              {kickstarter.finish_date}
            </span>
          </div>
          <div className="pr-2 ml-auto mt-auto">
            <a className="stretched-link x-link-without-decoration" href="/test">
              <span className="text-secondary">Подробности</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(true);
  const history = useHistory();

  const { kickstarters } = useSelector((state) => state.kickstartersInfo);
  // let kickstarters;

  // const handleAddKikstarter = () => {
  //   dispatch(actions.openModal({ type: 'addKikstarter' }));
  // };
  // const handleRemoveKikstarter = (kickstarterId) => () => {
  //   dispatch(actions.openModal({ type: 'removeKikstarter', extra: { kickstarterId } }));
  // };
  // const handleEditKikstarter = (kickstarterId) => () => {
  //   dispatch(actions.openModal({ type: 'editKikstarter', extra: { kickstarterId } }));
  // };

  const handleAddKickstarters = () => {
    axios.get('/boardgames.json').then((boardgamesData) => {
      const parsed = kickService.parseKickstartersJson(boardgamesData.data);
      kickService.uploadResources(parsed).then((result) => {
        console.log(result);
      });
    });
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
            onClick={handleAddKickstarters}
          >
            {t('mainPage.addKickstarter')}
          </Button>
        </div>
        <Modal />
        <main className="">
          <div className="row">
            {kickstarters.map((kickstarter) => (
              <Kickstarter
                key={kickstarter.id}
                kickstarter={kickstarter}
              />
            ))}
          </div>
        </main>
      </>
    );
};

export default MainPage;
