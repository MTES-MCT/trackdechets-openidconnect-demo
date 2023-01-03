import * as passport from "passport";
import { v4 as uuidv4 } from "uuid";
import { Strategy as OIDCStrategy } from "passport-openidconnect";


const { CLIENT_SECRET, CLIENT_ID, FRONT_ROOT, API_ROOT, SESSION_SECRET, CALLBACK_URL } = process.env;

passport.use(
  new OIDCStrategy(
    {
      issuer: API_ROOT,
      authorizationURL: `${FRONT_ROOT}/oidc/authorize/dialog`,
      tokenURL: `${API_ROOT}/oidc/token`,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ["profile email companies"],
      passReqToCallback: true,
      nonce: uuidv4(),
      sessionKey: SESSION_SECRET,
    },
    function verify(issuer, profile, cb, rest) {
      return cb(null, profile);
    }
  )
);
