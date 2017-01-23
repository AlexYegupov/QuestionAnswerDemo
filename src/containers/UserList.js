import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
//import { /* testLogin, testLogout*//* , loadStarred*/} from '../actions'
import { login, logout } from '../actions/authActions'
import { loadUsers, deleteUser } from '../actions/usersActions'

import User2 from '../components/User2'
//import LU from '../components/LoggedUser'
import Repo from '../components/Repo'
// import List from '../components/List'
// import zip from 'lodash/zip'
import { Link } from 'react-router'

class UserList extends Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    usersError: PropTypes.object,
    loggedUser: PropTypes.object,
    loadUsers: PropTypes.func.isRequired,

    login: PropTypes.func,
    logout: PropTypes.func,
    deleteUser: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {error: '', users: []}
  }

  componentWillMount() {
    console.log('CWM')
    //console.log('Cookie:', document.cookie)
    this.props.loadUsers()
  }

  componentWillReceiveProps(nextProps) {
    console.log('CWRP', this.props, nextProps)
  }

  createClick = () => {
    console.log('CREATE', this)
  }

  editClick = (slug) => {
    //this.props.loadStargazers(this.props.fullName, true)
    console.log('EDIT', this, slug)
  }

  deleteClick = (slug) => {
    //this.props.loadStargazers(this.props.fullName, true)
    console.log('DELETE', this, slug)
    this.props.deleteUser(slug)
  }

  logout = () => {
    // actually not log out because cannot delete httpOnly cookie
    this.props.logout()
  }

  renderRepo([ repo, owner ]) {
    return (
      <Repo
        repo={repo}
        owner={owner}
        key={repo.fullName} />
    )
  }

  renderError() {
    if (this.props.usersError)
      return <p>Error: {JSON.stringify(this.props.usersError)}</p>
  }

  render() {
    const { users, loggedUser } = this.props
    const readOnly = !loggedUser
    let error = this.state.error
    console.log('RENDER', this.props, error)

    return (
      <div>
        <p>Logged as: { loggedUser ? loggedUser.name : ''} </p>

        <h3>Users:</h3>
        { this.renderError() }

        <Link to={`/users-create`}>
          <button disabled={readOnly}>Create</button>
        </Link>

        <table>
          <tbody>
            { users.map( (user) =>
              <tr key={ user.slug }>
                <td>
                  <User2 user={ user } />
                </td>
                <td>
                  <Link to={`/users/${user.slug}`}>
                    <button value="edit">
                      { loggedUser ? 'Edit' : 'View' }
                    </button>
                  </Link>
                  <button value="delete" disabled={!loggedUser}
                          onClick={this.deleteClick.bind(this, user.slug)}>
                    Delete
                  </button>
                </td>
              </tr>
              )
            }
          </tbody>
        </table>

        <div>{ error ? `Error: ${error}` : '' }</div>

        <hr />
        Other stuff:
        <ul>
          <li><Link to={"/login"}>login</Link></li>
          {/* <li><button onClick={this.login.bind(this)} >Login</button></li> */}
          <li><Link to={"/users"}>users list</Link></li>
          <li><Link to={"/users-create"}>create user</Link></li>
          <li><Link to={"/users/terry"}>terry user</Link></li>
          <li><Link to={"/users/bob"}>bob user</Link></li>
          <li><button onClick={this.logout.bind(this)} >Logout</button></li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('mapStateToProps', state, ownProps, state.users)

  return {
    //w users: state.users.users,
    //users: state.users.response,
    users: state.users.users,
    usersError: state.users.usersError,
    loggedUser: state.auth.loggedUser,
    //deletedUser: state.users.deletedUser
  }
}

export default connect(
  mapStateToProps,
  {
    loadUsers,
    //loadUser,
    //loadStarred
    login,
    logout,
    deleteUser
  }
)(UserList)
