import { User } from './models/models';
const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(null, user);
    });
});
  

passport.use(new GoogleStrategy({
    clientID:     "534517933876-gn7c6ioajst5hmqsgj68nrarfp1o7nof.apps.googleusercontent.com",
    clientSecret: "2xtsVaPx_YK8AYWH_WKLYbLT",
    callbackURL: "http://localhost:4000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    const query = {
      profile_id: profile.id, 
      first_name: profile.name.givenName, 
      last_name: profile.name.familyName,
      dp: profile.photos[0].value
    }
    const options = { upsert: true };

    User.findOneAndUpdate(query.profile_id, query, options, function(error, result) {
      if (error) return;
      return done(error, result); 
  }); 
  
  }));
