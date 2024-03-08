import storage from "@/utils/storage";
import { getRefreshToken } from "./getRefreshToken";

export const checkForValidAccessToken = async () => {
  const token = storage.getToken("spotify");
  const expiresIn = storage.getExpiresIn("spotify");
  if (token && expiresIn) {
    const expirationTime = Date.parse(expiresIn);
    return Date.now() < expirationTime ? token : await getRefreshToken();
  }
  return null;
};
