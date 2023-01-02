import * as express from "express";
import * as session from "express-session";
import * as passport from "passport";
import { getToken } from "./api";
import { saveToken, findToken } from "./tokens";

const jose = require("jose");
const spki = process.env.PUBLIC_KEY;

const { SESSION_SECRET } = process.env;
// Set specific type for req.user

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
  res.render("home");
});

app.get("/oidc/trackdechets", passport.authenticate("openidconnect"));

app.get("/oidc/trackdechets/callback", async (req, res) => {
  const code = req.query.code;

  const jwt = await getToken(code);

  const alg = "RS256";

  const publicKey = await jose.importSPKI(spki, alg);

  const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
    issuer: "trackdechets",
    audience: "brgm",
  });

  saveToken(payload.sub, { payload, protectedHeader });
  return res.redirect(`/result/${payload.sub}`);
});

app.get("/result/:userID", async (req, res) => {
  const { payload, protectedHeader } = findToken(req.params.userID);
  return res.render("result", { token: payload, alg: protectedHeader.alg });
});

app.listen(process.env.PORT || 3000);
