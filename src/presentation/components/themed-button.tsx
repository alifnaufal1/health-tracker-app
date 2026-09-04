import { Button, ButtonProps, Platform, StyleSheet } from "react-native";

import { Fonts, ThemeColor } from "@/presentation/constants/theme";
import { useTheme } from "../hooks/use-theme";

export type ThemedButtonProps = ButtonProps & {
  title: string;
  themeColor?: ThemeColor;
};

export function ThemedButton({
  title,
  themeColor,
  onPress,
}: ThemedButtonProps) {
  const theme = useTheme();

  return (
    <Button
      title={title}
      color={theme[themeColor ?? "background"]}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: "#3c87f7",
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
