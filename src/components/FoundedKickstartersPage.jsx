// @ts-check

import React, { useEffect, useState } from 'react';
import { Button, Image, ListGroup, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';

import { actions } from '../slices/index.js';
import apiRoutes from '../apiRoutes.js';
import routes from '../routes.js';
import { getFetch } from '../lib/utils.js';
import kickService from '../lib/kickstarters.js';

import getLogger from '../lib/logger.js';

const log = getLogger('FoundedKickstartersPage');
log.enabled = true;

const FoundedKickstarter = (props) => {
  const { foundedKickstarter, onClick } = props;
  const { images, kickstarter, selected } = foundedKickstarter;
  const containerClassNames = cn('d-flex', {
    'bg-success': selected,
  });

  return (
    <ListGroup.Item onClick={onClick}>
      <div className={containerClassNames}>
        <div>
          <Image src={images?.med} />
        </div>
        <div className="ml-2 col-lg-r col-md-6 col-12">
          <h6>{kickstarter.title}</h6>
          <span>INFO</span>
        </div>
      </div>
    </ListGroup.Item>
  );
};

const FoundedKickstartersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const foundedKickstarters = useSelector((state) => state.foundedKickstartersInfo.foundedKickstarters); // eslint-disable-line
  const history = useHistory();

  log('foundedKickstarters', foundedKickstarters);

  const onClick = (foundedKickstarterId) => {
    log('select', foundedKickstarterId);
    dispatch(actions.switchFoundedKicstarter({ foundedKickstarterId }));
  };

  const addKickstarters = async () => {
    const currentKickstarters = foundedKickstarters.filter(({ selected }) => selected)
      .map(({ images, kickstarter }) => ({ images, kickstarter }));

    const { data } = await getFetch()
      .post(apiRoutes.kickstartersPath(), currentKickstarters);
    const { parsedData, uploadedData } = data;
    await kickService.uploadResources(parsedData, uploadedData);

    history.replace({ pathname: `${routes.mainPage()}` });
  };

  return (
    <>
      <Button onClick={addKickstarters}>{t('mainPage.addKickstarter')}</Button>
      <ListGroup variant="flush">
        {foundedKickstarters.map((kick) => (
          <FoundedKickstarter
            key={kick.kickstarter.kickstarter_id}
            foundedKickstarter={kick}
            onClick={() => onClick(kick.kickstarter.kickstarter_id)}
          />
        ))}
      </ListGroup>
    </>
  );
};

export default FoundedKickstartersPage;
