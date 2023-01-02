import * as passport from "passport";
import { v4 as uuidv4 } from "uuid";
import { Strategy as OIDCStrategy } from "passport-openidconnect";

const ROOT = "http://ui-td.test";
const APIROOT = "http://api-td.ui-td.test";
const { CLIENT_SECRET, CLIENT_ID } = process.env;

passport.use(
  new OIDCStrategy(
    {
      issuer: APIROOT,
      authorizationURL: `${ROOT}/oidc/authorize/dialog`,
      tokenURL: `${APIROOT}/oidc/token`,
      userInfoURL: `${APIROOT}/oidc/userinfo`,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "http://oauthdemo.td.test/oidc/trackdechets/callback",
      scope: ["profile email companies"],
      passReqToCallback: true,
      nonce: uuidv4(),
      sessionKey: "12345",
    },
    function verify(issuer, profile, cb, rest) {
      return cb(null, profile);
    }
  )
);
