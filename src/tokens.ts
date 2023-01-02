const tokens = {};

export function saveToken(key, token) {
  tokens[key] = token;
}
export function findToken(key: string) {
  if (tokens[key]) {
    return tokens[key];
  } else {
    throw new Error("token not found");
  }
}
