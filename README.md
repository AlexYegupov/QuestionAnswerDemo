About
==============
Demo questions and answers editor web application.

Implemented via React/Redux + node + postgres.

This project was built with Create React App.


Features
-----------

* REST-api server on nodejs + express
* routing by react-router
* es6, babel
* react + redux
* dev & prod versions


Requirements
=================

Implement a small demo Q&A web-application in a style of stackoverflow.com

Basic functionality:
- Authentication and authorisation are not required. User identification is perfomed by username
- User should have ability to see a list of:
   - all questions
   - unanswered questions
   - answered questions
- User should have ability to see on the separated page a question and all it's answers
- user should be available to ask a question
- user should have ability to answer on any question

It's recommended to use frameworks like React.js, Node.js, sails.js, Sequilize.
The one of RDBMS is mandatory to be used.

The amount of any question's answers is not limited.

The implementation details not specified here should be implemented on the developer discretion.



### Original requirements (in russian) ###

Тестовое завдання №2

Необходимо реализовать небольшое веб-приложение в стиле Q&A сервиса stackoverflow.com.

Базовый функционал:
 * аутентификация и авторизация не требуется
идентификация пользователей осуществляется по юзернейму
 * пользователь должен иметь возможность увидеть список 1) всех вопросов, 2) неотвеченных вопросов, 3) отвеченных вопросов
 * пользователь должен иметь возможность увидеть на отдельной странице конкретный вопрос со всеми ответами на него
 * пользователь должен иметь возможность задать новый вопрос
 * пользователь должен иметь возможность написать ответ на конкретный вопрос

Будет плюсом, если вы используете фреймворки / библиотеки, которые используются у нас (например, React.js, Node.js, sails.js, Sequilize). Обязательно использовать одну из RDBMS и SQL.

Количество ответов на один и тот же вопрос не ограничено.

Неуточнённые детали реализуются по усмотрению разработчика.




Installation (tested on ubuntu 14.04)
--------------------------------------------

### 1. Init database (tested on postgres 9.3.16) ###


* Create `stackover` postgress database

* Create `<OS_USER>` database user with all priveleges on database and `secret` password


Note: use env variables to customize values (see `src/settings.js`)

* Create database objects

```sql
create table users(
    id serial primary key,
    name varchar(300)
);

alter table users add unique (name);
alter table users alter column name set not null;

insert into users(id, name) values (1, 'john');
insert into users(id, name) values (2, 'paul');
insert into users(id, name) values (3, 'ringo');
insert into users(id, name) values (4, 'george');

create table question(
    id serial primary key,
    text varchar(1000),
    userId integer references users
);

alter table question alter column text set not null;
alter table question alter column userId set not null;
alter table question add unique (text);

insert into question (id, text, userId) values (1, 'what they do in a bed?', 1);
insert into question (id, text, userId) values (2, 'why dont we do it in a road?', 2);

create table answer(
    id serial primary key,
    questionId integer references question,
    text varchar(1000),
    userId integer references users
);

alter table answer alter column questionid set not null;
alter table answer alter column userId set not null;
alter table answer alter column text set not null;

insert into answer (id, questionId, text, userId) values (1, 1, 'q1 a1', 3);
insert into answer (id, questionId, text, userId) values (2, 1, 'q2 a2', 4);

```


### 2. Activate fresh nodejs version (tested on v7.0.0) ###

(The nvm optionally could be used for that)

```bash
source ~/.nvm/nvm.sh
nvm use v7
```


### 3. Install ###


```bash
git clone https://github.com/AlexYegupov/QuestionAnswerDemo
cd QuestionAnswerDemo
npm i

```

Check `src/settings.js` contains correct values. Otherwise you can customize them by env variables.


### 4. Run development version


```bash
npm run dev
```

If everything is ok then http://localhost:3000 should be succesfully opened in browser.


### 5. (optionally) Build and run production version

Build production version (to `build` directory) and run REST-api node server:
```bash
npm run build
npm run server
```

in parallel terminal execute web server. For example:
```bash
(cd build && python -m SimpleHTTPServer 9000)
```

If everything is ok then http://localhost:9000 should be succesfully opened in browser.


Screnshots
---------------------
![screenshots](https://github.com/AlexYegupov/QuestionAnswerDemo/blob/master/ss.png?raw=true)

Database:

![database screenshots](https://github.com/AlexYegupov/QuestionAnswerDemo/blob/master/ss_db.png?raw=true)



TODO
---------------

clear new questions and answer after successful creating

keep "user" value through all forms (store in redux storage)


