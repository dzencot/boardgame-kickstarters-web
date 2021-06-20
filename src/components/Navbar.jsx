// @ts-check
import React from 'react';
import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useAuth from '../hooks/index.js';

const Navbar = () => {
  const { logOut, user } = useAuth();
  const { t } = useTranslation();
  return (
    <BootstrapNavbar bg="light" expand="lg" className="mb-3">
      <BootstrapNavbar.Brand as={Link} to="/?page=0" className="mr-auto">{t('mainPage.title')}</BootstrapNavbar.Brand>
      {!!user && <Button className="bg-success" onClick={logOut}>{t('logout')}</Button>}
    </BootstrapNavbar>
  );
};

export default Navbar;
