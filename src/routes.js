import React from 'react'
import { Route,
         //Redirect,
         IndexRedirect } from 'react-router'
//import App from './containers/App'
import NotFoundPage from './containers/NotFoundPage'

import QuestionList from './containers/QuestionListPage'
import QuestionDetails from './containers/QuestionDetailsPage'


//
// function requireAuth(store, nextState, replace) {
//   const state = store.getState()
// 
//   if (!state.auth.loggedUser) {
//     replace({
//       pathname: '/login',
//       state: { nextPathname: nextState.location.pathname },
//     })
//   }
// }

// 
// function onLoginSuccess(nextState, replace) {
//   const state = store.getState()
//   console.log('RO onLoginSuccess', nextState)
// 
//   if (!state.auth.loggedUser) {
//   replace({
//     pathname: nextState.location.state,
//     //state: { nextPathname: nextState.location.pathname }
//   })
//   //}
// 
// }

// function onLoginLeave(prevState) {
//   console.log('RO onLoginLeave', prevState)
// }


export const createRoutes = (store) => (
  <Route path="/" >
    <IndexRedirect to="/questions" />

    <Route path="/questions" component={QuestionList} />
    <Route path="/questions/:id" component={QuestionDetails} />

    {/*<Route path="/login" component={LoginPage} />
     <Redirect from="/loginSuccess" to="/users" /> */}
    <Route path="/404" component={NotFoundPage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
)















