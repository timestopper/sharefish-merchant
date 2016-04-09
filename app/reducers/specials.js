import { GET_SPECIALS, SAVE_SPECIAL, UPDATE_SPECIAL, DELETE_SPECIAL } from '../actions/specials';


export default function currentUser(specials = {location: {}, items: []}, action) {
  switch (action.type) {
    case GET_SPECIALS:
      return {location: action.location, items: action.specials.slice(), inLoad: action.inLoad};
    case SAVE_SPECIAL:
      let items = specials.items.slice();
      if (!action.inSave) {
        items.unshift(action.special);
      }
      return {items: items, inLoad: false, inSave: action.inSave}
    case UPDATE_SPECIAL:
      return specials;
    case DELETE_SPECIAL:
      let index = 0;
      for (let item of specials.items) {
        if (item.id === action.special.id) {
          break;
        }
        index += 1
      }
      if (specials.items.length === 1) {
        return {items: [], inLoad: false}
      } else {
        let newItems = specials.items.slice();
        newItems.splice(index, 1);
        return {items: newItems, inLoad: false}
      }
    default:
      return {inLoad: false, items: specials.items}
  }
}
