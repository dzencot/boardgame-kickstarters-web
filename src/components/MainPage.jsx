// @ts-check
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Image } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
// import axios from 'axios';

import Modal from './modals/Modal.jsx';
import { actions } from '../slices/index.js';
import routes from '../routes.js';
import apiRoutes from '../apiRoutes.js';
// import kickService from '../lib/kickstarters.js';
import { getFetch } from '../lib/utils.js';

import getLogger from '../lib/logger.js';

const PER_PAGE = 10;

const log = getLogger('MainPage');
log.enabled = true;

const Project = ({
  project,
}) => {
  // const { t } = useTranslation();

  const previewUrl = `${routes.apiPath()}${project?.image?.url}`;

  return (
    <div key={project.id} className="col-lg-4 col-md-6 col-12 mt-3">
      <div className="card shadow-sm x-shadow-fade-in h-100">
        <div className="card-header text-white py-2 bg-success text-truncate">
          <h5>{project.title}</h5>
        </div>
        <div className="d-flex">
          <div className="p-2">
            <Image src={previewUrl} className="main__project_preview-image" />
          </div>
          <div>
            <span>{project.description}</span>
          </div>
        </div>
        <div className="d-flex pb-2">
          <div className="pl-2">
            <span>
              {project.finish_date}
            </span>
          </div>
          <div className="pr-2 ml-auto mt-auto">
            <a className="stretched-link x-link-without-decoration" href={`/projects/${project.id}`}>
              <span className="text-secondary">Подробности</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
const Kickstarter = ({
  kickstarter,
}) => {
  // const { t } = useTranslation();

  const previewUrl = `${routes.apiPath()}${kickstarter?.image_med?.url}`;

  return (
    <div key={kickstarter.id} className="col-lg-4 col-md-6 col-12 mt-3">
      <div className="card shadow-sm x-shadow-fade-in h-100">
        <div className="card-header text-white py-2 bg-success text-truncate">
          <h5>{kickstarter.title}</h5>
        </div>
        <div className="d-flex">
          <div className="p-2">
            <Image src={previewUrl} className="main__project_preview-image" />
          </div>
          <div>
            <span>{kickstarter.description}</span>
          </div>
        </div>
        <div className="d-flex pb-2">
          <div className="pl-2">
            <span>
              {kickstarter.finish_date}
            </span>
          </div>
          <div className="pr-2 ml-auto mt-auto">
            <a className="stretched-link x-link-without-decoration" href={`/kickstarters/${kickstarter.id}`}>
              <span className="text-secondary">Подробности</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainPage = () => {
  const query = new URLSearchParams(useLocation().search);
  // query.get('page');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(query.get('page') || 0);
  const history = useHistory();

  const { kickstarters, allCount: kickstartersCount } =
    useSelector((state) => state.kickstartersInfo);
  const { projects, allCount: projectsCount } = useSelector((state) => state.projectsInfo);
  const allCount = kickstartersCount + projectsCount;
  const pageCount = Math.ceil(allCount / PER_PAGE);
  const offset = parseInt(currentPage, 10) * PER_PAGE;

  const handleAddKickstarter = () => {
    dispatch(actions.openModal({ type: 'addKikstarter' }));
  };

  const handlePageClick = (event) => {
    log('click page', event);
    history.push({
      pathname: routes.mainPage(),
      search: `?page=${event.selected}`,
    });
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    // NOTE this removes warning in tests https://github.com/facebook/react/issues/14369
    // eslint-disable-next-line functional/no-let
    let didMount = true;
    const fetchData = async () => {
      try {
        const kickUrl = `${routes.kickstartersPath()}?_limit=${PER_PAGE / 2}&_start=${(PER_PAGE / 2) * currentPage}`;
        const [kickResponse, countResponse] = await Promise.all([
          getFetch().get(kickUrl),
          getFetch().get(`${routes.kickstartersPath()}/count`),
        ]);
        const kickData = kickResponse.data;
        dispatch(actions.setKickstarters({ kickstarters: kickData, allCount: countResponse.data }));

        const projectsUrl = `${apiRoutes.projectPath()}?_limit=${PER_PAGE / 2}&_start=${(PER_PAGE / 2) * currentPage}`;
        const [projectResponse, countProjectsResponse] = await Promise.all([
          getFetch().get(projectsUrl),
          getFetch().get(`${apiRoutes.projectPath()}/count`),
        ]);
        dispatch(actions.setProjects({
          projects: projectResponse.data,
          allCount: countProjectsResponse.data,
        }));
        if (didMount) setFetching(false);
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
  }, [currentPage]);

  return fetching
    ? (
      <Spinner animation="grow" role="status" variant="primary">
        <span className="sr-only">{t('loading')}</span>
      </Spinner>
    )
    : (
      <>
        <div className="d-flex mb-2">
          <a
            href="/projects/new"
          >
            {t('mainPage.addProject')}
          </a>
          <Button
            type="button"
            variant="link"
            className="ml-auto p-0"
            onClick={handleAddKickstarter}
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
            {projects.map((project) => (
              <Project
                key={project.id}
                project={project}
              />
            ))}
          </div>
          <div className="row d-flex justify-content-center">
            <ReactPaginate
              previousLabel="previous"
              nextLabel="next"
              breakLabel="..."
              breakClassName="break-me"
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              initialPage={parseInt(currentPage, 10)}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
              pageClassName="page-item"
              nextClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextLinkClassName="page-link"
            />
          </div>
        </main>
      </>
    );
};

export default MainPage;
