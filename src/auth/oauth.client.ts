export interface OauthClient {
  getAccessToken(code: string);

  getSocialInfo(accessToken: string);
}
