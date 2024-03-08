const storage = {
  getToken: (service: string) => {
    try {
      const token = JSON.parse(
        window.localStorage.getItem(`${service}_token`) as string,
      );
      return token;
    } catch (error) {
      console.error(`Failed to parse token for ${service}`, error);
      return null; // Or return a different default value
    }
  },
  setToken: (service: string, token: string) => {
    window.localStorage.setItem(`${service}_token`, JSON.stringify(token));
  },
  clearToken: (service: string) => {
    window.localStorage.removeItem(`${service}_token`);
  },
  getRefreshToken: (service: string) => {
    return JSON.parse(
      window.localStorage.getItem(`${service}_refresh_token`) as string,
    );
  },
  setRefreshToken: (service: string, token: string) => {
    window.localStorage.setItem(
      `${service}_refresh_token`,
      JSON.stringify(token),
    );
  },
  clearRefreshToken: (service: string) => {
    window.localStorage.removeItem(`${service}_expires_in`);
  },
  getExpiresIn: (service: string) => {
    return JSON.parse(
      window.localStorage.getItem(`${service}_expires_in`) as string,
    );
  },
  setExpiresIn: (service: string, token: number) => {
    const now = new Date();
    const expiry = new Date(now.getTime() + token * 1000);
    window.localStorage.setItem(
      `${service}_expires_in`,
      JSON.stringify(expiry),
    );
  },
  clearExpiresIn: (service: string) => {
    window.localStorage.removeItem(`${service}_refresh_token`);
  },
  getUserName: () => {
    return JSON.parse(window.localStorage.getItem(`username`) as string);
  },
  setUserName: (username: string) => {
    window.localStorage.setItem(`username`, JSON.stringify(username));
  },
  clearUsername: () => {
    window.localStorage.removeItem(`username`);
  },
  getCodeVerifier: () => {
    return window.localStorage.getItem(`code_verifier`);
  },
  setCodeVerifier: (code_verifier: string) => {
    window.localStorage.setItem(`code_verifier`, code_verifier);
  },
  clearCodeVerifier: () => {
    window.localStorage.removeItem(`code_verifier`);
  },
  getAccessToken: () => {
    return window.localStorage.getItem(`access_token`);
  },
  setAccessToken: (response: any) => {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("expires_in", expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    localStorage.setItem("expires", expiry.toString());
  },
  clearAccessToken: () => {
    window.localStorage.removeItem(`access_token`);
  },
};

export default storage;
