import { limitPhoneInput } from "./limitPhoneInput";

export function limitIdentifierInput(text: string): string {
  const looksLikeEmail = /[a-zA-Z@]/.test(text);
  if (looksLikeEmail) return text;
  return limitPhoneInput(text);
}