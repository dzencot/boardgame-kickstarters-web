// @ts-check

import React, { useEffect, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Modal from './modals/Modal.jsx';
import { actions } from '../slices/index.js';
import routes from '../routes.js';
import { getFetch } from '../lib/utils.js';

const Contract = ({ contract }) => (
  <>
    <tr>
      <th scope="row">1</th>
      <td>{contract.user?.username}</td>
      <td>{contract.count}</td>
    </tr>
  </>
);

const Pledge = ({ pledge }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const contracts = useSelector((state) =>
    state.contractsInfo.contracts.filter((contract) => contract.pledge === pledge.id));
  const handleAddContract = () => {
    dispatch(actions.openModal({ type: 'addContract', extra: { pledge } }));
  };

  return (
    <div className="table-responsive-md table-striped">
      <div className="card-header text-white py-2 bg-success text-truncate">
        <h6 className="mb-0">{pledge.title}</h6>
      </div>
      <table className="table">
        <caption>
          <div className="d-flex justify-content-between">
            <span>{t('kickstarter.usersList')}</span>
            <Button
              type="button"
              className="bg-success"
              onClick={handleAddContract}
            >
              {t('modals.contract.addContract')}
            </Button>
          </div>
        </caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">{t('contractTable.userName')}</th>
            <th scope="col">{t('contractTable.count')}</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => <Contract key={contract.id} contract={contract} />)}
        </tbody>
      </table>
    </div>
  );
  // return (
  //   <div className=" mb-2">
  //     <div className="">
  //       <div className="col-lg-r col-md-6 col-12 mt-3 d-inline-block">
  //         <span className="text-right">
  //           {pledge.title}
  //         </span>
  //       </div>
  //       <div className="col-lg-3 col-md-6 col-12 mt-3 d-inline-block">
  //         {pledge.price}
  //       </div>
  //     </div>
  //     <Button
  //       type="button"
  //       variant="link"
  //       className="ml-auto p-0"
  //       onClick={handleAddContract}
  //     >
  //       {t('modals.contract.addContract')}
  //     </Button>
  //   </div>
  // );
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
