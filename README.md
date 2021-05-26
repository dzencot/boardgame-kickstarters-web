[![Node.js CI](https://github.com/dzencot/boardgame-kickstarters-web/actions/workflows/node.js.yml/badge.svg)](https://github.com/dzencot/boardgame-kickstarters-web/actions/workflows/node.js.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/b6183f44971e621bf21d/maintainability)](https://codeclimate.com/github/dzencot/boardgame-kickstarters-web/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/b6183f44971e621bf21d/test_coverage)](https://codeclimate.com/github/dzencot/boardgame-kickstarters-web/test_coverage)

# Фронтенд-приложение для сбора заказов

## Ресурсы

Бэкенд [https://github.com/dzencot/boardgame-kickstarter-api](https://github.com/dzencot/boardgame-kickstarter-api)

Развернутое фронтенд-приложение на тестовом стенде [https://boardgame-kickstarter-web.herokuapp.com](https://boardgame-kickstarter-web.herokuapp.com/)

Развернутое бэкенд-приложение на тестовом стенде [https://boardgame-kickstarter-strapi.herokuapp.com](https://boardgame-kickstarter-strapi.herokuapp.com/)

Стоит учитывать, что приложения на тестовом стенде находятся в состоянии гибернации и поднимаются при первом заходе на сайт. Поэтому, если долго не пользовались стендом, зайдите на адрес бэкенда, дождитесь поднятия(появится страница с сообщением), и после этого заходите на фронт, и ждите пока там тоже поднимется.

## Локальный запуск

Скачайте репозиторий бэкенда и установите зависимости:

```bash
$ git clone git@github.com:dzencot/boardgame-kickstarter-api.git
$ cd boardgame-kickstarter-api
$ make install
```

Запустите в режиме разработки:

```bash
$ make start-develop
```

Откроется окно регистрации, зарегайтесь. Откроется админка апи. Теперь запустим фронтенд! Клонируем, устанавливаем, запускаем:

```bash
$ git clone git@github.com:dzencot/boardgame-kickstarters-web.git
$ make install
$ make start
```

Если нет `make`, то можно использовать напрямую скрипты `npm` из `package.json`.

## Чем помочь

* Можно тестировать, заводить ишью.
* Писать код. Используем функциональные компоненты, `redux-toolkit`, тесты с использованием `testing-library`.
