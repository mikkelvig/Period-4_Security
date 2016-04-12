/**
 * Created by Mikkel on 13-04-2016.
 */

// Explain and demonstrate a system using jwt's, focusing on both client and server side.



// Here passport.authenticate is used to authenticate the one trying to access something from /api
app.use('/api', function (req, res, next) {
    passport.authenticate('jwt', {session: false}, function (err, user, info) {
        if (err) {
            res.status(403).json({mesage: "Not authenticated...", fullError: err})
        }
        if (user) {
            return next();
        }
        return res.status(403).json({mesage: "Not authenticated...", fullError: info});
    })(req, res, next);
});




// This checks JSON Web Token from a client, and if the user is in the DB.
module.exports = function (passport) {

    var opts = {};
    opts.secretOrKey = jwtConfig.secret;
    opts.issuer = jwtConfig.issuer;
    opts.audience = jwtConfig.audience;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({username: jwt_payload.sub}, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            }
            else {
                done(null, false, "User in token wasn't found...");
            }
        })
    }))
};