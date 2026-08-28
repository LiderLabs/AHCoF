import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}