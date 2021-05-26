// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

import {
  render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import init from '../init.jsx';

beforeEach(async () => {
  const vdom = await init();
  render(vdom);
  userEvent.click(await screen.findByText(/Заказы на кикстартере/i));
});

describe('auth', () => {
  test('login page on enter as guest', async () => {
    expect(window.location.pathname).toBe('/login');
    expect(await screen.findByLabelText(/Ваш ник/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Пароль/i)).toBeInTheDocument();
  });

  // test('handle login error', async () => {
  //   server.use(rest.post('/api/v1/login', (_req, res, ctx) => res(ctx.status(401))));
  //   expect(screen.queryByText(/Неверные имя пользователя или пароль/i)).not.toBeInTheDocument();
  //   userEvent.type(await screen.findByLabelText(/Ваш ник/i), 'guest');
  //   userEvent.type(await screen.findByLabelText(/Пароль/i), 'pass');
  //   userEvent.click(await screen.findByRole('button', { name: /Войти/i }));

  //   expect(await screen.findByText(/Неверные имя пользователя или пароль/i)).toBeInTheDocument();
  // });

  // test('successful login', async () => {
  //   server.use(
  //     rest.post('/api/v1/login', mockSingin),
  //     rest.get('/api/v1/data', mockInitialData),
  //   );

  //   userEvent.type(await screen.findByLabelText(/Ваш ник/i), 'user');
  //   userEvent.type(await screen.findByLabelText(/Пароль/i), 'pass');
  //   userEvent.click(await screen.findByRole('button', { name: /Войти/i }));

  //   await waitFor(() => {
  //     expect(window.location.pathname).toBe('/');
  //   });
  // });
});

