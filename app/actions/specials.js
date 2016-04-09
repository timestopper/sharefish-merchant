export const GET_SPECIALS = 'GET_SPECIALS';
export const SAVE_SPECIAL = 'SAVE_SPECIAL';
export const UPDATE_SPECIAL = 'UPDATE_SPECIAL';
export const DELETE_SPECIAL = 'DELETE_SPECIAL';


export function getSpecials(day) {
  var query = new Parse.Query('Locations');
  query.include('User');
  query.equalTo('User', Parse.User.current());

  return dispatch => {
    return query.first({
      success: function(location) {
        var query = new Parse.Query('Specials');

        query.include('Merchant');
        query.equalTo('Merchant', location);
        query.equalTo('Dates', day);

        dispatch(
          (() => {
            return {
              type: GET_SPECIALS,
              specials: [],
              inLoad: true,
              location: location
            };
          })()
        );

        query.find({
          success: function(results) {
            return dispatch( (() => {
              return {
                type: GET_SPECIALS,
                specials: results,
                inLoad: false,
                location: location
              };
            })())
          }
        })
      }
    });

  }
}


export function saveSpecial(data, day) {
  var Special = Parse.Object.extend('Specials');
  var special = new Special(data);

  special.set('Dates', day);

  return dispatch => {
    dispatch(
      (() => {
        return {
          type: SAVE_SPECIAL,
          inSave: true
        };
      })()
    );

    var query = new Parse.Query('Locations');

    query.include('User');
    query.equalTo('User', Parse.User.current());

    return query.first({
      success: function(location) {
        var point = location.attributes.Location;

        special.set("Location", point);
        special.set("BarName", location.attributes.Name);
        special.set("Merchant", location);

        special.save(null,
          {
            success: (special) => {
              return dispatch( (() => {
                return {
                  type: SAVE_SPECIAL,
                  special: special,
                  inSave: false
                };
              })())
            },
          }
        );
      }
    });

  }
}

export function updateSpecial(special) {
  return dispatch => {
    return special.save(null,
      {
        success: (special) => {
          return dispatch( (() => {
            return {
              type: UPDATE_SPECIAL,
              special: special
            };
          })())
        },
      }
    );

  }
}

export function deleteSpecial(special) {
  return dispatch => {
    return special.destroy(
      {
        success: (special) => {
          return dispatch( (() => {
            return {
              type: DELETE_SPECIAL,
              special: special
            };
          })())
        },
      }
    );

  }
}
