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

        // verify whether location has the 'Daily' property
        if ( !location.attributes['Daily'] ) {

          let hourAndNotes = [
            ['10am-5pm', ' ']
            , ['10am-6pm', ' ']
            , ['10am-7pm', ' ']
            , ['10am-7pm', ' ']
            , ['10am-8pm', ' ']
            , ['10am-5pm', ' ']
            , ['10am-5pm', ' ']
          ];

          location.set( 'Daily', hourAndNotes );
          location.save(null, {
            success: function(location) {
                console.log('location updated', location);
            },
            error: function(res, err) {
                console.log('location updating error', res, err);
            },
          });
        } 


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
        });
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
                  inSave: false,
                  location: location
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
  var query = new Parse.Query('Locations');

    query.include('User');
    query.equalTo('User', Parse.User.current());


    return dispatch => {

      return query.first({
        success: function(location) {

          return special.save(null,
            {
              success: (special) => {
                return dispatch( (() => {
                  return {
                    type: UPDATE_SPECIAL,
                    special: special,
                    location: location
                  };
                })())
              },
            }
          );

        }
      });

    }
}

export function deleteSpecial(special, location) {
  return dispatch => {
    return special.destroy(
      {
        success: (special) => {
          return dispatch( (() => {
            return {
              type: DELETE_SPECIAL,
              special: special,
              location: location
            };
          })())
        },
      }
    );

  }
}

export function updateHoursAndNotes(location, curHours, curDay, special) {

  let dayToIndex = {
      Sun : 0
      ,Mon : 1
      ,Tue : 2
      ,Wed : 3
      ,Thu : 4
      ,Fri : 5
      ,Sat : 6
  };

  let hourAndNotes = location.attributes['Daily'];

  hourAndNotes[ dayToIndex[curDay] ] = curHours;

  location.set( 'Daily', hourAndNotes );

  return dispatch => {
    return  location.save(null, {
              success: function(location) {

                return dispatch( (() => {
                  return {
                    type: UPDATE_SPECIAL,
                    special: special
                  };
                })())

              },
              error: function(res, err) {
                console.log('location updating error', res, err);
              }
            });

        };

}
