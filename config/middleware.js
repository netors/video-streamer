var passport = require('passport')
    , GitHubStrategy = require('passport-github').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {

        User.findOne(
                {
                    or : [
                            {uid: parseInt(profile.id)},
                            {uid: profile.id}
                        ]
                }
            ).done(function (err, user) {
            if (user) {
                return done(null, user);
            } else {
                User.create({
                    provider: profile.provider,
                    uid: profile.id,
                    name: profile.displayName
                }).done(function (err, user) {
                        return done(err, user);
                    });
            }
        });
    });
};

passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
    User.findOne({uid: uid}).done(function (err, user) {
        done(err, user)
    });
});


module.exports = {

    // Init custom express middleware
    express: {
        customMiddleware: function (app) {

            passport.use(new GitHubStrategy({
                    clientID: "YOUR_CLIENT_ID",
                    clientSecret: "YOUR_CLIENT_SECRET",
                    callbackURL: "http://home-sd.rusanval.com:1338/auth/github/callback"
                },
                verifyHandler
            ));

            passport.use(new FacebookStrategy({
                    clientID: "188786314652617",
                    clientSecret: "a2c30ab6da1c227071e0930caf92676f",
                    callbackURL: "http://home-sd.rusanval.com:1338/auth/facebook/callback"
                },
                verifyHandler
            ));

            passport.use(new GoogleStrategy({
                    clientID: 'YOUR_CLIENT_ID',
                    clientSecret: 'YOUR_CLIENT_SECRET',
                    callbackURL: 'http://home-sd.rusanval.com:1338/auth/google/callback'
                },
                verifyHandler
            ));

            app.use(passport.initialize());
            app.use(passport.session());
        }
    }

};
