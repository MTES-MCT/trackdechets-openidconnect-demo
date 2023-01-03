import * as request from "superagent";

const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, API_ROOT } = process.env;

export async function getToken(code) {
  const res = await request
    .post(`${API_ROOT}/oidc/token`)
    .set("Accept", "application/json")
    .send({
      code,
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: CALLBACK_URL,
    });
  return res.body.idToken;
}
