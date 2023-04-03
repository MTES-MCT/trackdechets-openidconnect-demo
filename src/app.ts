import * as express from "express";
import * as session from "express-session";
import * as passport from "passport";
import { getTokens } from "./api";
import { saveToken, findToken } from "./tokens";

const jose = require("jose");

const { SESSION_SECRET, AUDIENCE, PUBLIC_KEY, FRONT_ROOT } = process.env;

export const app = express();

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// load oidc config

require("./oidc");

app.get("/", (_req, res) => {
  res.render("home", { frontRoot: FRONT_ROOT });
});

app.get("/oidc/trackdechets", passport.authenticate("openidconnect"));

app.get("/oidc/trackdechets/callback", async (req, res) => {
  const error = req.query.error;
  if (!!error) {
    if (error === "access_denied") {
      return res.redirect("/denied/");
    }
    return res.send("Erreur technique");
  }
  const code = req.query.code;

  const { id_token: jwt, access_token } = await getTokens(code);

  const alg = "RS256";

  const publicKey = await jose.importSPKI(PUBLIC_KEY, alg);
  let payload = "",
    protectedHeader = "";
  try {
    ({ payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
      issuer: "trackdechets",
      audience: AUDIENCE,
    }));

    console.log(payload, protectedHeader);
    saveToken(payload["sub"], { payload, protectedHeader, access_token });
  } catch (e) {
    console.log(e);
    return res.send("Error");
  }

  return res.redirect(`/result/${payload?.sub}`);
});

app.get("/result/:userID", async (req, res) => {
  const { payload, protectedHeader, access_token } = findToken(
    req.params.userID
  );
  return res.render("result", {
    token: payload,
    alg: protectedHeader.alg,
    access_token,
  });
});

app.get("/denied/", async (req, res) => {
  return res.render("denied");
});
app.listen(process.env.PORT || 3000);
