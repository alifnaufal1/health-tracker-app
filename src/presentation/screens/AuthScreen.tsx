import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FormMessage,
  PrimaryButton,
  TextField,
  TextLink,
} from "../components/FormComponents";
import { useAuth } from "../hooks/useAuth";

export type AuthMode = "signIn" | "signUp";
export type AuthPreviewState =
  | "default"
  | "invalid"
  | "connection"
  | "redirected"
  | "loading"
  | "usernameTaken"
  | "keyboard";

function initialValues(mode: AuthMode, state: AuthPreviewState) {
  const populated = [
    "invalid",
    "connection",
    "loading",
    "usernameTaken",
    "keyboard",
  ].includes(state);
  return {
    name: mode === "signUp" && populated ? "Alex Morgan" : "",
    password: populated ? "morningrun" : "",
    username: populated ? "alexrunner" : "",
  };
}

function StackHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to Home"
          onPress={onBack}
          style={styles.backButton}
        >
          <ChevronLeft color="white" />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.divider} />
    </>
  );
}

function KeyboardPreview() {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["⇧", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.keyboard}
    >
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keyboardRow}>
          {row.map((key) => (
            <View
              key={key}
              style={[
                styles.key,
                {
                  width:
                    rowIndex === 2 && (key === "⇧" || key === "⌫") ? 48 : 31,
                },
              ]}
            >
              <Text style={styles.keyText}>{key}</Text>
            </View>
          ))}
        </View>
      ))}
      <View style={styles.keyboardBottomRow}>
        <View style={[styles.key, { width: 78 }]}>
          <Text style={[styles.keyText, styles.keyTextSmall]}>123</Text>
        </View>
        <View style={[styles.key, { flex: 1 }]} />
        <View style={[styles.key, styles.returnKey, { width: 78 }]}>
          <Text style={[styles.keyText, styles.returnKeyText]}>return</Text>
        </View>
      </View>
    </View>
  );
}

export default function AuthScreen({
  mode,
  onBack,
  onSwitch,
  previewState = "default",
}: {
  mode: AuthMode;
  onBack: () => void;
  onSwitch: () => void;
  previewState?: AuthPreviewState;
}) {
  const { register, login } = useAuth();

  const isSignIn = mode === "signIn";
  const isLoading = previewState === "loading";
  const keyboardOpen = previewState === "keyboard";
  const defaults = initialValues(mode, previewState);

  const [username, setUsername] = useState(defaults.username);
  const [name, setName] = useState(defaults.name);
  const [password, setPassword] = useState(defaults.password);

  const complete = Boolean(username && password && (isSignIn || name));
  const usernameError = !isSignIn && previewState === "usernameTaken";
  const credentialsError = isSignIn && previewState === "invalid";
  const connectionError = previewState === "connection";

  const handleSignUp = async () => {
    await register({ name, username, password });
  };

  const handleSignIn = async () => {
    await login(username, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StackHeader onBack={onBack} title={isSignIn ? "Sign in" : "Sign up"} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.form,
          keyboardOpen ? styles.formKeyboard : styles.formDefault,
        ]}
      >
        {isSignIn && previewState === "redirected" && (
          <FormMessage
            body="This smartwatch is already registered to another account. Sign in with that account to continue. Your runs are still saved on this phone."
            title="Signed out"
            variant="notice"
          />
        )}

        <TextField
          error={
            usernameError ? (
              <>
                This username is already taken. Choose another one, or{" "}
                <TextLink onPress={onSwitch}>sign in</TextLink> if it's your
                account.
              </>
            ) : undefined
          }
          label="Username"
          onChange={setUsername}
          placeholder="Enter your username"
          state={
            isLoading
              ? "disabled"
              : usernameError || credentialsError
                ? "error"
                : undefined
          }
          value={username}
        />

        {!isSignIn && (
          <TextField
            label="Name"
            onChange={setName}
            placeholder="Enter your name"
            state={isLoading ? "disabled" : undefined}
            value={name}
          />
        )}

        <TextField
          autoFocus={keyboardOpen}
          error={
            credentialsError ? "Incorrect username or password." : undefined
          }
          label="Password"
          onChange={setPassword}
          password
          placeholder="Enter your password"
          state={
            isLoading
              ? "disabled"
              : credentialsError
                ? "error"
                : keyboardOpen
                  ? "focused"
                  : undefined
          }
          value={password}
        />

        <View style={[styles.actions, { marginTop: keyboardOpen ? 1 : 6 }]}>
          {connectionError && (
            <FormMessage
              body={
                isSignIn
                  ? "Couldn't connect to the server. Check your connection and try again."
                  : "Registration failed. Check your connection and try again."
              }
              variant="error"
            />
          )}
          <PrimaryButton
            disabled={!complete}
            loading={isLoading}
            onPress={handleSignUp}
          >
            {isLoading
              ? isSignIn
                ? "Signing in..."
                : "Creating account..."
              : isSignIn
                ? "Sign in"
                : "Sign up"}
          </PrimaryButton>
          {!keyboardOpen && (
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {isSignIn
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </Text>
              <TextLink onPress={isSignIn ? handleSignUp : handleSignIn}>
                {isSignIn ? "Sign up" : "Sign in"}
              </TextLink>
            </View>
          )}
        </View>
      </ScrollView>
      {keyboardOpen && <KeyboardPreview />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: "hidden",
    paddingTop: 8,
    backgroundColor: "#0D0D0D",
  },

  // StackHeader
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#151515",
    borderColor: "#242424",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  title: {
    color: "#f5f5f5",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  divider: {
    backgroundColor: "#181818",
    height: 1,
    marginHorizontal: 24,
  },

  // Form
  form: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  formDefault: {
    gap: 22,
    paddingTop: 34,
  },
  formKeyboard: {
    gap: 15,
    paddingTop: 16,
  },
  actions: {
    gap: 16,
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  switchText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },

  // KeyboardPreview
  keyboard: {
    backgroundColor: "#171717",
    borderTopColor: "#292929",
    borderTopWidth: 1,
    bottom: 0,
    height: 300,
    left: 0,
    paddingBottom: 8,
    paddingHorizontal: 7,
    paddingTop: 12,
    position: "absolute",
    right: 0,
    zIndex: 4,
  },
  keyboardRow: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginBottom: 8,
  },
  keyboardBottomRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  key: {
    alignItems: "center",
    backgroundColor: "#303030",
    borderRadius: 6,
    height: 42,
    justifyContent: "center",
  },
  keyText: {
    color: "#d0d0d0",
    fontSize: 12,
  },
  keyTextSmall: {
    color: "#aaa",
    fontSize: 11,
  },
  returnKey: {
    backgroundColor: "#29633e",
  },
  returnKeyText: {
    color: "#d8eadf",
    fontSize: 11,
  },
});
