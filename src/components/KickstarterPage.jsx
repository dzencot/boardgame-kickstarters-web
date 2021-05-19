import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import getAuthToken from '../lib/auth.js';
import { actions } from '../slices/index.js';
import routes from '../routes.js';

const Contract = ({ contract }) => {
  return (
    <div id={contract.id}>
    </div>
  );
};

const KickstarterPage = (props) => {
  const { id } = props.match.params;
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);
  const { kickstarter } = useSelector((state) => state.contractsInfo);

  useEffect(() => {
    // NOTE this removes warning in tests https://github.com/facebook/react/issues/14369
    // eslint-disable-next-line functional/no-let
    let didMount = true;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${routes.kickstartersPath()}/${id}`,
          {
            headers: {
              Authorization: getAuthToken(),
            },
          });
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

  return <>{ id }</>;
};

export default KickstarterPage;
