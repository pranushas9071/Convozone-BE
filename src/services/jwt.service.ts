import jsonwebtoken from "jsonwebtoken";

class JwtService {
  createToken(username: string) {
    const secret_key = "SecreTKeyfOrChAtAppLicatioN";
    const data = {
      username: username,
    };
    const token = jsonwebtoken.sign(data, secret_key as string);
    return token;
  }
}

export const jwtService = new JwtService();
