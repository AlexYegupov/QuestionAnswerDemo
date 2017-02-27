import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
//import { /* testLogin, testLogout*//* , loadStarred*/} from '../actions'
//import { test } from '../actions/authActions'
//import { login, logout } from '../actions/authActions'
import { loadQuestions, createQuestion } from '../actions/questionActions'
//import { refreshLoggedUser } from '../actions/authActions'

// import User from '../components/User'
// import LoggedUser from '../components/LoggedUser'
// // import List from '../components/List'
// // import zip from 'lodash/zip'
import { Link } from 'react-router'
import './QuestionList.css'
import { formatUnknownError } from '../utils/errorUtil'


const DISPLAY_QUESTIONS = ['all', 'unanswered', 'answered']

class QuestionList extends Component {
  static propTypes = {
  //   users: PropTypes.array.isRequired,
  //   usersError: PropTypes.object,
  //   loggedUser: PropTypes.object,
  //   //test: PropTypes.func.isRequired,
  //   loadUsers: PropTypes.func.isRequired,
  // 
  //   login: PropTypes.func,
  //   logout: PropTypes.func,
  //   deleteUser: PropTypes.func,
  //   refreshLoggedUser: PropTypes.func
    questions: PropTypes.array,
    questionsError: PropTypes.object,

    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props)

    // NOTE: in case of complicating logic move to redux store and components
    this.state = {
      displayQuestions: 'all',
      filteredQuestions: [],
      newQuestion: '',
      userName: '',
    }

    //this.state = {error: '', users: []}
  }

  refreshFilteredQuestions(displayQuestions, questions) {
    console.log('RFQ', displayQuestions, questions)

    let filteredQuestions = []

    switch (displayQuestions) {
      case 'answered':
        // TODO: investigate why answercount is NOT number
        filteredQuestions = questions.filter(q => Number(q.answercount) > 0)
        break;
      case 'unanswered':
        filteredQuestions = questions.filter(q => Number(q.answercount) === 0)
        break;
      case 'all':
      default:
        filteredQuestions = questions
    }

    console.log('FQ', filteredQuestions)
    this.setState( {filteredQuestions}  )

  }

  componentWillMount() {
    console.log('CWM', this.state.displayQuestions)
    //console.log('Cookie:', document.cookie)
    this.props.dispatch(loadQuestions())

    this.refreshFilteredQuestions(this.state.displayQuestions, this.props.questions)

    //"hope to restore" logged user from server on mount
    //if (!this.props.loggedUser) {
    //  this.props.refreshLoggedUser()
    //}
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('CWU', this.props.location.pathname, nextProps, nextState)

    if (this.state.displayQuestions !== nextState.displayQuestions) {
      this.refreshFilteredQuestions(nextState.displayQuestions, this.props.questions)
    }

  }

  componentWillReceiveProps(nextProps) {
    console.log('%cCWRP', 'background: lightgray', this.props, nextProps)

    // simply reload questions
    if (nextProps.createdQuestion && !nextProps.questionsError) {
      this.props.dispatch(loadQuestions())
    }

    // Note: ideally should compare old and new questions arrays
    this.refreshFilteredQuestions(this.state.displayQuestions, nextProps.questions)


  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('CWRP', this.props, nextProps)
  // }
  // 
  // createClick = () => {
  //   console.log('CREATE', this)
  // }
  // 
  // editClick = (slug) => {
  //   //this.props.loadStargazers(this.props.fullName, true)
  //   console.log('EDIT', this, slug)
  // }
  // 
  // deleteClick = (slug) => {
  //   //this.props.loadStargazers(this.props.fullName, true)
  //   console.log('DELETE', this, slug)
  //   this.props.deleteUser(slug)
  // }
  // 
  // logout = () => {
  //   // actually not log out because cannot delete httpOnly cookie
  //   this.props.logout()
  // }
  // 
  // renderError() {
  //   if (this.props.usersError)
  //     return <p>Error: {JSON.stringify(this.props.usersError)}</p>
  // }

  handleFilterChange(event) {
    this.setState({ displayQuestions: event.target.value })
  }

  createQuestion() {
    //console.log('cQ', this.state.newQuestion )
    this.props.dispatch(createQuestion({
      'text': this.state.newQuestion,
      'userName': this.state.userName
    }))
  }

  render() {
    const state = this.state

    const displayQuestionsRadioGroup = () => DISPLAY_QUESTIONS.map( val => (
      <li key={val}>
        <label>
          <input type="radio" name="optradio"
                 value={val} defaultChecked={state.displayQuestions === val}/>
          { val }
        </label>
      </li>
      )
    )

    return (
      <div>
        <h2>Questions</h2>

        <div>
          <input
              placeholder="Your name" type="text" className="userName"
              value={this.state.userName}
              onChange={ ev => this.setState({userName: ev.target.value}) } />
          <textarea
              placeholder="Your question"
              value={this.state.newQuestion}
              onChange={ ev => this.setState({newQuestion: ev.target.value}) } />
          <button onClick={this.createQuestion.bind(this)}>Ask</button>
        </div>


        <div className="error" >
          { formatUnknownError(this.props.questionsError) }
        </div>

        <hr />

        <form onChange={this.handleFilterChange.bind(this)}>
          <ul className="filter">
            { displayQuestionsRadioGroup() }
          </ul>
        </form>

        <table>
          <tbody>
            { this.state.filteredQuestions.map( (question) =>
              <tr key={ question.id }>
                <td>
                  { question.text }
                </td>
                <td className="questionAskee">
                  { question.username }
                </td>
                <td>
                  <Link to={`/api/questions/${question.id}`}>
                    Details
                  </Link>
                </td>
                {/*<td>
                <button value="delete" disabled={!loggedUser}
                onClick={this.deleteClick.bind(this, user.slug)}>
                Delete
                </button>
                </td> */}
              </tr>
              )
            }
          </tbody>
        </table>

      </div>
    )

    // const { users, loggedUser } = this.props
    // const readOnly = !loggedUser
    // let error = this.state.error
    // console.log('RENDER', this.props, error)
    // 
    // return (
    //   <div>
    //     {/* <p>Logged as: { loggedUser ? loggedUser.name : ''}</p>*/}
    // 
    //     <LoggedUser user={ loggedUser } />
    // 
    //     <h2>Users</h2>
    //     { this.renderError() }
    // 
    //     <Link to={`/users-create`}>
    //       <button disabled={readOnly}>Create</button>
    //     </Link>
    // 
    //     <table>
    //       <tbody>
    //         { users.map( (user) =>
    //           <tr key={ user.slug }>
    //             <td>
    //               <User user={ user } />
    //             </td>
    //             <td>
    //               <Link to={`/users/${user.slug}`}>
    //                 <button value="edit">
    //                   { loggedUser ? 'Edit' : 'View' }
    //                 </button>
    //               </Link>
    //             </td>
    //             <td>
    //               <button value="delete" disabled={!loggedUser}
    //                       onClick={this.deleteClick.bind(this, user.slug)}>
    //                 Delete
    //               </button>
    //             </td>
    //           </tr>
    //           )
    //         }
    //       </tbody>
    //     </table>
    // 
    //     <div>{ error ? `Error: ${error}` : '' }</div>
    // 
    // 
    //     <div className="otherStuff">
    //       <ul>
    //         <li><Link to={"/login"}>login</Link></li>
    //         <li><Link to={"/users"}>users list</Link></li>
    //         <li><Link to={"/users-create"}>create user</Link></li>
    //         <li><Link to={"/users/terry"}>terry user</Link></li>
    //         <li><Link to={"/users/bob"}>bob user</Link></li>
    //         {/*<li><button onClick={this.logout.bind(this)} >Logout</button></li>*/}
    //       </ul>
    //     </div>
    //   </div>
    // )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('mapStateToProps', state, ownProps)

  return {
    questions: state.questions.questions,
    questionsError: state.questions.questionsError,
    createdQuestion: state.questions.createdQuestion,
    // users: state.users.users,
    // usersError: state.users.usersError,
    // loggedUser: state.auth.loggedUser,

  }
}

export default connect(
  mapStateToProps,

  // {
  //   loadUsers,
  //   login,
  //   logout,
  //   deleteUser,
  //   refreshLoggedUser
  // }

)(QuestionList)
