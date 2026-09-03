import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const BIOMETRIC_ENABLED_KEY = "biometricEnabled";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function setBiometricEnabled(enabled: boolean) {
  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled ? "true" : "false");
}

export async function getBiometricEnabled() {
  const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
  return value === "true";
}