import { SIGNUP, SIGNIN, EDIT } from '../actions/user';


export default function currentUser(currentUser = {}, action) {
  switch (action.type) {
    case SIGNUP:
      return action.user;
    case SIGNIN:
      return action.user;
    case EDIT:
      return action.user;
    default:
      return currentUser
  }
}
