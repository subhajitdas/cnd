import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

export default function (app, userRepository, securityConfig) {
    passport.use(new JWTStrategy({
        secretOrKey: securityConfig.jwt.secret,
        issuer: securityConfig.jwt.issuer,
        audience: securityConfig.jwt.audience,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT')
    }, async (token, done) => {
        try {
            const user = await userRepository.getById(token.sub);
            if (user && (user.isActive === true)) {
                done(null, user);
            } else {
                done('User not active/registered', false);
            }
        } catch (err0r) {
            done(err, false);
        }
    }));
    app.use(passport.initialize());
}