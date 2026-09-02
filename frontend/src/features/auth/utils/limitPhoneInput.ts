export function limitPhoneInput(text: string, maxLength: number = 10): string {
  const digitsOnly = text.replace(/\D/g, ""); 
  return digitsOnly.slice(0, maxLength);
}