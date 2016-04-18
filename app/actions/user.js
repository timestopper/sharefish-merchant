export const SIGNUP = 'SIGNUP';
export const SIGNIN = 'SIGNIN';
export const EDIT = 'EDIT';


export function signUp(userData) {
  var user = new Parse.User();

  user.set("firstName", userData.firstName);
  user.set("lastName", userData.lastName);

  user.set("username", userData.username);
  user.set("password", userData.password);
  user.set("email", userData.username);
  user.set("stripe_customer_id", userData.stripe_customer_id);

  var geocoder = new google.maps.Geocoder();

  return dispatch => {
    return geocoder.geocode({'address': userData.address}, (results, status) => {
      var location = results[0].geometry.location;
      var lat, lng;

      lat = location.lat();
      lng = location.lng();

      var point = new Parse.GeoPoint({latitude: lat, longitude: lng});

      user.signUp(null,
        {
          success: (user) => {
            var Location = Parse.Object.extend("Locations");
            var location = new Location();

            location.set("Name", userData.venueName);
            location.set("Address", userData.address);
            location.set("Phone", userData.phoneNumber);
            location.set("Males", 0);
            location.set("Females", 0);
            location.set("User", user);
            location.set("Avg_Age", 21);
            location.set("Singles", 0);
            location.set("Location", point);
            location.set("Description", userData.venueDescription);
            location.set("Website_Address", userData.websiteAddress);

            userData.file.save().then(
              function(file) {
                location.set("Image", file);

                location.save(null, {
                  success: function(location) {
                    user.location = location;
                    user.set("Location", location);
                    user.save(null, {
                      success: (user) => {
                        return dispatch( (() => {
                          return {
                            type: SIGNUP,
                            user: user
                          };
                        })());
                      }
                    });
                  }
                });
              }
            )
          },
        }
      );
    });
  }
}

export function editProfile(user, location, userData) {
  return dispatch => {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': userData.address}, (results, status) => {
      var loc = results[0].geometry.location;
      var lat, lng;

      lat = loc.lat();
      lng = loc.lng();

      var point = new Parse.GeoPoint({latitude: lat, longitude: lng});

      user.set("firstName", userData.firstName);
      user.set("lastName", userData.lastName);

      user.set("username", userData.username);
      user.set("password", userData.password);
      user.set("email", userData.username);

      user.save(null, {
        success: function(user) {
          location.set("Name", userData.venueName);
          location.set("Address", userData.address);
          location.set("Phone", userData.phoneNumber);
          location.set("Location", point);
          location.set("Description", userData.venueDescription);

          userData.file.save().then(
            function(file) {
              location.set("Image", file);

              location.save(null, {
                success: function(location) {
                  user.location = location;
                  return dispatch( (() => {
                    return {
                      type: EDIT,
                      user: user
                    };
                  })())
                },

                error: function() {
                  user.location = false;
                  return dispatch( (() => {
                    return {
                      type: EDIT,
                      user: user
                    };
                  })())

                }
              });
            }
          )

        },

        error: function(location, error){
          alert("couldn't save user :/ " + error.message);
        }
      });
    });
  }
}

export function signIn(email, password) {
  return dispatch => {
    return Parse.User.logIn(email, password,
      {
        success: (user) => {
          var query = new Parse.Query('Locations');

          query.include('User');
          query.equalTo('User', user);

          query.first({
            success: function(location) {
              user.location = location;
              return dispatch( (() => {
                return {
                  type: SIGNIN,
                  user: user,
                };
              })())
            }
          })
        },
        error: () => {
          return dispatch( (() => {
            return {
              type: SIGNIN,
              user: false,
            };
          })())
        },
      }
    );
  }
}
