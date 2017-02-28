import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadQuestionAndAnswers, createAnswer } from '../actions/answerActions'
import { Link } from 'react-router'
import './QuestionDetailsPage.css'
import { formatUnknownError } from '../utils/errorUtil'


class QuestionDetails extends Component {
  static propTypes = {
    question: PropTypes.object,
    answers: PropTypes.array,
    answerError: PropTypes.object,

    dispatch: PropTypes.func,
    params: PropTypes.object,
  }

  constructor(props) {
    super(props)

    // NOTE: in case of complicating logic move to redux store and components
    this.state = {
      newAnswer: '',
      userName: '',
    }
  }

  componentWillMount() {
    console.log('CWM', this.state, this.props, this.props.params.id)

    // TODO: load question and answers (think: consequental
    this.props.dispatch(loadQuestionAndAnswers(this.props.params.id))
    //this.props.dispatch(loadAnswers(this.props.question.id))

    // this.refreshFilteredQuestions(this.state.displayQuestions, this.props.questions)

    //"hope to restore" logged user from server on mount
    //if (!this.props.loggedUser) {
    //  this.props.refreshLoggedUser()
    //}
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('CWU', nextProps, nextState)

    // if (this.state.displayQuestions !== nextState.displayQuestions) {
    //   this.refreshFilteredQuestions(nextState.displayQuestions, this.props.questions)
    // }

  }

  componentWillReceiveProps(nextProps) {
    console.log('%cCWRP', 'background: lightgray', this.props, nextProps)

    // simply reload
    if (nextProps.createdAnswer && !nextProps.answerError) {
      this.props.dispatch(loadQuestionAndAnswers(this.props.params.id))
    }

    // // Note: ideally should compare old and new questions arrays
    // this.refreshFilteredQuestions(this.state.displayQuestions, nextProps.questions)


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

  // handleFilterChange(event) {
  //   this.setState({ displayQuestions: event.target.value })
  // }

  createAnswer() {
    this.props.dispatch(createAnswer({
      'questionId': this.props.params.id,
      'text': this.state.newAnswer,
      'userName': this.state.userName
    }))
  }

  render() {
    let question = this.props.question || {}
    //let title = (question.text || '').slice(0, 10) + '...'

    return (
      <div>
        <Link to={"/questions"}>↰ back to all questions</Link>

        <h2>Question</h2>
        <p className="author">by { question.username } </p>
        <p>{ question.text }</p>

        <h3>Answers</h3>
          <ul className="answers">
            { this.props.answers.map( a =>
              <li key={ a.id }>
                <span>{ a.text }</span>
                <span className="author">&nbsp;({ a.username })</span>
              </li>
              )
            }
          </ul>

        <div>
          <input className="userName"
              placeholder="Your name" type="text"
              value={this.state.userName}
              onChange={ ev => this.setState({userName: ev.target.value}) } />
          <textarea
              placeholder="Your answer"
              value={this.state.newAnswer}
              onChange={ ev => this.setState({newAnswer: ev.target.value}) } />
          <button onClick={this.createAnswer.bind(this)}>Answer</button>
        </div>


        <div className="error" >
          { formatUnknownError(this.props.answersError) }
        </div>

      </div>
    )

  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('mapStateToProps', state, ownProps)

  return {
    question: state.answers.question,
    answers: state.answers.answers,
    answersError: state.answers.answersError,
    createdAnswer: state.answers.createdAnswer,
  }
}

export default connect(
  mapStateToProps,
  // {
  //   refreshLoggedUser
  // }

)(QuestionDetails)
