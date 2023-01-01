const tokens = {};

export function saveToken(token) {
  tokens[token.sub] = token;
}
export function findToken(sub: string) {
  if (tokens[sub]) {
    return tokens[sub];
  } else {
    throw new Error("token not found");
  }
}
