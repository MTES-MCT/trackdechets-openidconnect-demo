import * as supertest from "supertest";
import { app } from "../app";
import * as querystring from "querystring";

// load .env file into process.env
require("dotenv").config();

const request = supertest(app);

const { AUTHORIZATION_URL, CALLBACK_URL, CLIENT_ID } = process.env;

describe("GET /auth/trackdechets", () => {
  it("should redirect to authorization url", async () => {
    const res = await request.get("/auth/trackdechets");
    const redirect = res.header["location"];

    const queries = {
      response_type: "code",
      redirect_uri: CALLBACK_URL,
      client_id: CLIENT_ID
    };

    querystring.stringify(queries);
    const expected = `${AUTHORIZATION_URL}?${querystring.stringify(queries)}`;
    expect(redirect).toEqual(expected);
  });
});
