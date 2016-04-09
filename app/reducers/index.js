import { combineReducers } from 'redux';
import user from './user';
import specials from './specials';

const rootReducer = combineReducers({
  user,
  specials
});

export default rootReducer;
