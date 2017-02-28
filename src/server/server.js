/* eslint-disable no-console, no-use-before-define */

import Express from 'express'

// import webpack from 'webpack'
// import webpackDevMiddleware from 'webpack-dev-middleware'
// import webpackHotMiddleware from 'webpack-hot-middleware'
// import webpackConfig from '../webpack.config'

//import React from 'react'
//import { renderToString } from 'react-dom/server'
//import { Provider } from 'react-redux'

//import configureStore from '../common/store/configureStore'
//import App from '../common/containers/App'
//import { fetchCounter } from '../common/api/counter'
import bodyParser from 'body-parser';
//import session from 'express-session'
import settings from '../settings'
//import { Users } from './dbUtil'

var cors = require('cors')
const app = new Express()

// // Use this middleware to set up hot module reloading via webpack.
// const compiler = webpack(webpackConfig)
// app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
// app.use(webpackHotMiddleware(compiler))

// const low = require('lowdb')
// const fileAsync = require('lowdb/lib/file-async')
// const yaml = require('js-yaml');
// 
// const YAMLFormat = {
//   serialize: (obj) => yaml.safeDump(obj),
//   deserialize: (data) => yaml.safeLoad(data)
// }
// 
// const db = low('server/db.yaml', {
//   storage: fileAsync,
//   format: YAMLFormat
// })


// check: ?global variables
let pgp = require('pg-promise')(/*options*/)

// see https://github.com/vitaly-t/pg-promise/wiki/Connection-Syntax#configuration-object
let db = pgp({
  database: settings.dbName,
  password: settings.dbPassword,
  user: settings.dbUser,
  //host: settings.dbHost,
})

// // Note: storing session in memory (ok for demo)
// app.use(session({
//   secret: 'myASQR$Rsecretasfdhkasdfhflkasjhfjqwef98p1y32',
//   resave: false,
//   saveUninitialized: false,
//   //cookie: { maxAge: 60000 }
//   name: 'THESESSION'
// }));

app.use(bodyParser.json())
//app.use(bodyParser.raw({type: '*/*'}))
app.use(bodyParser.urlencoded( { extended: true } ))

// to allow cors request (quick demo solution)
app.use(cors({credentials: true, origin: true}))


// function checkAuth(router) {
//   function secureRouter(req, res, next) {
//     //console.log('RS, RSU', req.session, req.session.user)
//     if (!req.session || !req.session.user) {
//       res.status(403).send('unauthorized').end()
//       return
//     }
//     return router(req, res, next)
//   }
// 
//   return secureRouter
// }

// // post = create session = login
// app.post('/api/session', function(req, res) {
//   const { login, pwd } = req.body
//   let user = Users.login(login, pwd)
//   if (!user) return res.status(401).json({'message': 'Wrong credentials'}).end()
// 
//   req.session.user = user
// 
//   //req.session.cookie
//   //return Promise.resolve(user);
// 
//   //req.session.message = 'Hello World ' + new Date()
//   res.json(user).end()
// })
/



// Note: left sql/ddl hardcoded & processing db errors maximally simply because in real project those optimizations could depend on a lot of requirements



// TODO: change camelCase to underlined_case everywhere because postgres minimizes it

app.get('/api/questions', function(req, res) {
  db.any(`select question.id, min(question.text) as text,
                 min(question.userId) as userId,
                 min(users.name) as userName,
                 count(answer.id) as answerCount
            from question inner join users on question.userid = users.id
                 left join answer on answer.questionId = question.id
          group by question.id
          order by min(question.text)
         `)
    .then( data => {
      res.json(data).end()
    })
    .catch( error => {
      res.status(400).json(error).end()
    })
})

app.get('/api/questions/:id', function(req, res) {
  db.oneOrNone(`select question.id, question.text, question.userId,
                       users.name as userName
                  from question inner join users on question.userid = users.id
                 where question.id = $1`, [req.params.id])
    .then( data => {
      res.json(data).end()
    })
    .catch( error => {
      res.status(400).json(error).end()
    })
})


function upsertUser(name) {
  // NOTE: temporary solution. For latest postgres should use INSERT INTO ... ON CONFLICT

  return db.one('insert into users (name) values ($1) returning id, name', [name] )
    .catch(
      (error) => {
        if (error.detail.includes('already exists')) {
          return db.one('select id, name from users where name = $1', [name])
        } else {
          throw error
        }
      })
}


// use POST only for CREATING new questions
app.post('/api/questions', function(req, res) {
  console.log('body', req.body)

  Promise.resolve(
  ).then( () => {
    // naive checking
    if (!req.body.userName) throw new Error('Question user should be non-empty')
    if (!req.body.text) throw new Error('Question text should be non-empty')
  }).then( () => {
    return upsertUser(req.body.userName)
  }).then(
    userData => db.one(
      `insert into question(text, userId) values($<text>, $<userId>)
             returning id, text, userid`,
      {
        text: req.body.text,
        userId: userData.id
      }
    )
  ).then(
    data => {
      res.json(data).end()
    }
  ).catch( e => {
    console.log('e:', e, JSON.stringify(e))
    res.status(400).json({'error': e, 'message': e.message}).end()
  })

})

app.get('/api/questions/:id/answers', function(req, res) {
  db.any(`select answer.*, users.name as userName
            from answer inner join users on answer.userId = users.id
           where answer.questionId = $1`, [req.params.id])
    .then( data => {
      res.json(data).end()
    })
    .catch( error => {
      res.status(400).json(error).end()
    })
})

// app.get('/api/questions/:questionId/answers/:answerId', function(req, res) {
//   db.oneOrNone(`select question.id, question.text, question.userId,
//                        users.name as userName
//                   from question inner join users on question.userid = users.id
//                  where question.id = $1`, [req.params.id])
//     .then( data => {
//       res.json(data).end()
//     })
//     .catch( error => {
//       res.status(400).json(error).end()
//     })
// })


// use POST only for CREATING new answers
app.post('/api/questions/:questionId/answers', function(req, res) {
  let data = Object.assign({}, req.body, {questionId: req.params.questionId})

  Promise.resolve(
  ).then(
    () => {
      if (!data.userName) throw new Error('Answer user should be non-empty')
      if (!data.text) throw new Error('Answer text should be non-empty')
    }
  ).then(
    () => upsertUser(data.userName)
  ).then(
    userData =>
      db.one(`insert into answer(questionId, text, userId)
          values ($<questionId>, $<text>, $<userId>) returning id, text, userid`, Object.assign({}, data, {userId: userData.id}) )
  ).then(
    data =>
      res.json(data).end()
  ).catch(
    e =>
      res.status(400).json({'error': e, 'message': e.message}).end()
  )
})


app.get('', function handleRender(req, res) {
  res.send('it works').end()
})




app.listen(settings.apiPort, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> API server started at http://${settings.apiHost}:${settings.apiPort}`)
  }
})
