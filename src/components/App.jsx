// @ts-check

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
} from 'react-router-dom';

import Login from './Login.jsx';
import Registration from './Registration.jsx';
import authContext from '../contexts/index.js';
import MainPage from './MainPage.jsx';
import Navbar from './Navbar.jsx';
import KickstarterPage from './KickstarterPage.jsx';

// import useAuth from '../hooks/index.js';
import routes from '../routes.js';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { username: currentUser.username } : null);
  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return userData?.jwt ? { Authorization: `Bearer ${userData.jwt}` } : {};
  };

  return (
    <authContext.Provider value={{
      logIn, logOut, getAuthHeader, user,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

// const PrivateRoute = ({ children, ...props }) => {
//   const auth = useAuth();

//   return (
//     <Route
//       // eslint-disable-next-line react/jsx-props-no-spreading
//       {...props}
//       render={({ location }) => (auth.user
//         ? children
//         : <Redirect to={{ pathname: routes.loginPagePath(), state: { from: location } }} />)}
//     />
//   );
// };

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar />
        <Switch>
          <Route path={routes.loginPagePath()}>
            <Login />
          </Route>
          <Route path={routes.signupPagePath()}>
            <Registration />
          </Route>
          <Route path={routes.mainPagePath()} exact>
            <MainPage />
          </Route>
          <Route path={routes.kickstartersPagePath()} component={KickstarterPage} />
        </Switch>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
