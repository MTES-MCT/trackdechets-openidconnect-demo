import * as supertest from "supertest";
import { app } from "../app";
import * as url from "url";

// load .env file into process.env
require("dotenv").config();

const request = supertest(app);

const { CALLBACK_URL, CLIENT_ID } = process.env;

describe("GET /oidc/trackdechets", () => {
  it("should redirect to authorization url", async () => {
    const res = await request.get("/oidc/trackdechets");
    const redirect = res.header["location"];

    const queries = {
      response_type: "code",
      redirect_uri: CALLBACK_URL,
      client_id: CLIENT_ID,
      scope: "openid profile email companies",
    };

    // console.log(redirect)
    const parsedRedirect = url.parse(redirect, true).query;
    const { nonce, state, ...redirectQueryParams } = parsedRedirect;

    expect(redirectQueryParams).toEqual(queries);
  });
});
