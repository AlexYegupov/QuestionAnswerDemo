import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import { questions } from './questionReducer'
import { answers } from './answerReducer'
import { combineForms } from 'react-redux-form'

const DefaultUser = {firstName: '?', lastName: '', email: ''}

const rootReducer = combineReducers({
  forms: combineForms({
    user: DefaultUser
  }, 'forms'),
  questions,
  answers,
  //users,
  //auth,
  routing
})

export default rootReducer
