// @ts-check

import React, { useEffect, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Modal from './modals/Modal.jsx';
import { actions } from '../slices/index.js';
import routes from '../routes.js';
import { getFetch } from '../lib/utils.js';

const Contract = ({ contract }) => {
  return (
    <div id={contract.id}>
    </div>
  );
};

const Pledge = ({ pledge }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const contract = {};
  const handleAddContract = () => {
    dispatch(actions.openModal({ type: 'addContract', extra: { contract } }));
  };

  return (
    <div className=" mb-2">
      <div>
        <div>{pledge.title}</div>
        <div>{pledge.price}</div>
      </div>
      <Button
        type="button"
        variant="link"
        className="ml-auto p-0"
        onClick={handleAddContract}
      >
        {t('modals.contract.addContract')}
      </Button>
    </div>
  );
};

const KickstarterPage = (props) => {
  const { t } = useTranslation();
  const { id } = props.match.params;
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);
  const { kickstarter } = useSelector((state) => state.contractsInfo);
  const kickImageUrl = `${routes.apiPath()}${kickstarter?.image_full?.url}`;

  useEffect(() => {
    // NOTE this removes warning in tests https://github.com/facebook/react/issues/14369
    // eslint-disable-next-line functional/no-let
    let didMount = true;
    const fetchData = async () => {
      try {
        const { data } = await getFetch().get(`${routes.kickstartersPath()}/${id}`);
        if (didMount) setFetching(false);
        dispatch(actions.setContractsData({ kickstarter: data }));
      } catch (err) {
        if (!err.isAxiosError) {
          throw err;
        }

        // TODO: network error to toast
        throw err;
      }
    };

    fetchData();

    return () => { didMount = false; };
  }, [dispatch]);

  const handleAddPledge = () => {
    dispatch(actions.openModal({ type: 'addPledge', extra: { kickstarter } }));
  };

  return (
    <div>
      <Modal />
      <Image src={kickImageUrl} />
      <div className=" mb-2">
        <Button
          type="button"
          variant="link"
          className="ml-auto p-0"
          onClick={handleAddPledge}
        >
          {t('modals.pledge.addPledge')}
        </Button>
      </div>
      <div>
        {kickstarter?.pledges?.map((pledge) => <Pledge key={pledge.id} pledge={pledge} />)}
      </div>
    </div>
  );
};

export default KickstarterPage;
