const palette = {
  //Brand greens
  green50: "#E8F5E9",
  green100: "#C8E6C9",
  green300: "#81C784",
  green500: "#4C8C4A",
  green700: "#1B5E20",
  green900: "#0D3B10",

  //Secondary green
  mint200: "#ACF4A4",

  teal50: "#E0F2F1",
  teal100: "#B2DFDB",
  teal300: "#80CBC4",
  teal500: "#4DB6AC",
  teal700: "#00897B",
  teal900: "#00695C",

  //Neutrals
  black: "#000000",
  white: "#FFFFFF",
  charcaol900: "#41493E",

  //Blue
  blue500: "#2563EB",
  blue700: "#00529B",

  //Gray
  gray25: "#EDEEEF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray300: "#D1D5DB",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray900: "#111827",

  //Amber
  amber300: "#FFA857",
  amber500: "#FB923C",
  amber900: "#8E4E00",

  //Red
  red500: "#DC2626",
  redDark: "#BA1A1A",

};

export const colors = {
  //Brand
  primary: palette.green700,
  

  //Base / surfaces
  background: palette.white,
  splashGradient: [
          palette.black,
          "rgba(255,255,255,0.05)",
          "rgba(255,255,255,0.15)",
          "rgba(255,255,255,0.35)",
          "rgba(255,255,255,0.7)",
  ],
  splashGradientLocations: [0, 0.25, 0.45, 0.6, 0.75, 0.9, 1],

  //Text
  textLogo: palette.green700,
  textSecondary: palette.gray600,
  textPrimary: palette.charcaol900,
  textInverted: palette.white,

  //Border
  buttonBorder: palette.green700,
  
  //Button(bg and text)
  buttonTransparent: 'transparent',
  buttonTextPrimary: palette.white,
  buttonTextSecondary: palette.green700,

  //Icons
  iconColor: palette.gray600,

  //Overlays
   overlay: 'rgba(13, 59, 16, 0.3)',
   overlayLight: 'rgba(13, 59, 16, 0.15)',

   palette, 

};
