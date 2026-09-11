import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const BIOMETRIC_ENABLED_KEY = "biometricEnabled";

// expo-secure-store has no web implementation — SecureStore.setItemAsync
// etc. throw "is not a function" in a browser build. This is a dev/testing
// convenience so `npx expo start -c` + press `w` doesn't crash on login;
// it is NOT a secure storage mechanism on web (localStorage is readable by
// any script on the page) and shouldn't be relied on for a real web deploy.
const isWeb = Platform.OS === "web";

async function setItem(key: string, value: string) {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function saveToken(token: string) {
  await setItem(ACCESS_TOKEN_KEY, token);
}

export async function getToken() {
  return getItem(ACCESS_TOKEN_KEY);
}

export async function deleteToken() {
  await deleteItem(ACCESS_TOKEN_KEY);
}

export async function saveRefreshToken(token: string) {
  await setItem(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function deleteRefreshToken() {
  await deleteItem(REFRESH_TOKEN_KEY);
}

export async function setBiometricEnabled(enabled: boolean) {
  await setItem(BIOMETRIC_ENABLED_KEY, enabled ? "true" : "false");
}

export async function getBiometricEnabled() {
  const value = await getItem(BIOMETRIC_ENABLED_KEY);
  return value === "true";
}