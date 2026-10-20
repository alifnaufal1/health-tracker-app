// import { Ionicons } from "@expo/vector-icons";
import { AlertCircle, EyeIcon, InfoIcon } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export type TextFieldState =
  | "default"
  | "focused"
  | "filled"
  | "error"
  | "disabled";

export function TextLink({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Text
      accessibilityRole="link"
      onPress={onPress}
      style={styles.link}
      suppressHighlighting
    >
      {children}
    </Text>
  );
}

export function TextField({
  autoFocus = false,
  error,
  label,
  onChange,
  password = false,
  placeholder,
  state = "default",
  value,
}: {
  autoFocus?: boolean;
  error?: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  password?: boolean;
  placeholder?: string;
  state?: TextFieldState;
  value: string;
}) {
  const [focused, setFocused] = useState(autoFocus || state === "focused");
  const [showPassword, setShowPassword] = useState(false);
  const disabled = state === "disabled";
  const resolvedState = disabled
    ? "disabled"
    : state === "error"
      ? "error"
      : focused
        ? "focused"
        : value
          ? "filled"
          : state;
  const borderColor =
    resolvedState === "error"
      ? "#b95f62"
      : resolvedState === "focused"
        ? "#00e676"
        : "#242424";

  return (
    <View style={{ opacity: disabled ? 0.48 : 1 }}>
      <Text
        style={[
          styles.label,
          { color: resolvedState === "error" ? "#b95f62" : "#555" },
        ]}
      >
        {label}
      </Text>
      <View>
        <TextInput
          autoCapitalize="none"
          autoComplete={password ? "current-password" : "username"}
          autoCorrect={false}
          autoFocus={autoFocus}
          editable={!disabled}
          onBlur={() => setFocused(false)}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor="#777"
          secureTextEntry={password && !showPassword}
          value={value}
          style={[
            styles.input,
            {
              borderColor,
              color: value ? "#ededed" : "#777",
              paddingRight: password ? 52 : 18,
            },
          ]}
        />
        {password && (
          <Pressable
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            disabled={disabled}
            onPress={() => setShowPassword((visible) => !visible)}
            style={styles.eyeButton}
          >
            <EyeIcon color={showPassword ? "#00e676" : "#555"} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  children,
  disabled = false,
  loading = false,
  onPress,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}) {
  const dimmed = disabled && !loading;

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: dimmed ? "#173824" : "#00e676",
          opacity: dimmed ? 0.62 : 1,
        },
      ]}
    >
      {loading && <ActivityIndicator size="small" color="#09130d" />}
      <Text
        style={[styles.buttonText, { color: dimmed ? "#63856d" : "#09130d" }]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export function FormMessage({
  body,
  title,
  variant,
}: {
  body: React.ReactNode;
  title?: string;
  variant: "error" | "notice";
}) {
  if (variant === "error") {
    return (
      <View style={styles.errorRow}>
        <AlertCircle />
        {/* <Ionicons
          name="alert-circle-outline"
          size={16}
          color="#b95f62"
          style={styles.errorIcon}
        /> */}
        <Text style={styles.errorMessage}>{body}</Text>
      </View>
    );
  }

  return (
    <View style={styles.notice}>
      {/* <Ionicons
        name="information-circle"
        size={18}
        color="#9b7a35"
        style={styles.noticeIcon}
      /> */}
      <InfoIcon />
      <View style={styles.noticeContent}>
        {title ? <Text style={styles.noticeTitle}>{title}</Text> : null}
        <Text style={[styles.noticeBody, { marginTop: title ? 4 : 0 }]}>
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // TextLink
  link: {
    color: "#00e676",
    fontWeight: "600",
  },

  // TextField
  label: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 7,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#111",
    borderRadius: 20,
    borderWidth: 1,
    fontSize: 15,
    height: 56,
    paddingLeft: 18,
  },
  eyeButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 8,
    width: 40,
  },
  errorText: {
    color: "#b95f62",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 7,
  },

  // PrimaryButton
  button: {
    alignItems: "center",
    borderColor: "#00e676",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    height: 56,
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },

  // FormMessage (error)
  errorRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  errorIcon: {
    marginTop: 1,
  },
  errorMessage: {
    color: "#b95f62",
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },

  // FormMessage (notice)
  notice: {
    alignItems: "flex-start",
    backgroundColor: "#111",
    borderColor: "#242424",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  noticeIcon: {
    marginTop: 1,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    color: "#d0d0d0",
    fontSize: 13,
    fontWeight: "600",
  },
  noticeBody: {
    color: "#777",
    fontSize: 11,
    lineHeight: 16,
  },
});
