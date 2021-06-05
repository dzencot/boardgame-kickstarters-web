// @ts-check

import React, { useEffect, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Modal from './modals/Modal.jsx';
import { actions } from '../slices/index.js';
import routes from '../routes.js';
import { getFetch } from '../lib/utils.js';
import apiRoutes from '../apiRoutes.js';

const Contract = ({ contract }) => (
  <>
    <tr>
      <th scope="row">1</th>
      <td>{contract.user?.username}</td>
      <td>{contract.count}</td>
    </tr>
  </>
);

const ProjectPage = (props) => {
  const { t } = useTranslation();
  const { id } = props.match.params; // eslint-disable-line
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true); // eslint-disable-line
  const { project } = useSelector((state) => state.projectContractsInfo);
  const projectImageUrl = `${apiRoutes.apiPath()}${project?.image?.url}`;
  const contracts = project.project_contracts || [];

  useEffect(() => {
    // NOTE this removes warning in tests https://github.com/facebook/react/issues/14369
    // eslint-disable-next-line functional/no-let
    let didMount = true;
    const fetchData = async () => {
      try {
        const { data } = await getFetch().get(`${apiRoutes.projectPath()}/${id}`);
        if (didMount) setFetching(false);
        dispatch(actions.setProjectContractsData({ project: data }));
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
  }, []); // eslint-disable-line

  // const handleAddPledge = () => {
  //   dispatch(actions.openModal({ type: 'addPledge', extra: { kickstarter } }));
  // };
  const handleAddContract = () => {
    dispatch(actions.openModal({ type: 'addProjectContract', extra: { project } }));
  };

  return (
    <div>
      <Modal />
      <Image src={projectImageUrl} />
      <div className="table-responsive-md table-striped">
        <div className="card-header text-white py-2 bg-success text-truncate">
          <h6 className="mb-0">{project.title}</h6>
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
    </div>
  );
};

export default ProjectPage;
