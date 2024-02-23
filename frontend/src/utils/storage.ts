const storage = {
  getToken: (service: string) => {
    return JSON.parse(
      window.localStorage.getItem(`${service}_token`) as string
    );
  },
  setToken: (service: string, token: string) => {
    window.localStorage.setItem(`${service}_token`, JSON.stringify(token));
  },
  clearToken: (service: string) => {
    window.localStorage.removeItem(`${service}_token`);
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
