import React from "react";
import { Save, SquarePen } from "lucide-react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type UserInformationFormProps = {
  fullName: string;
  nickname: string;
  username: string;
  password: string;
  onChangeFullName: (v: string) => void;
  onChangeNickname: (v: string) => void;
  onChangeUsername: (v: string) => void;
  onChangePassword: (v: string) => void;
  onSubmit: () => void;
};

export function UserInformationForm({
  fullName,
  nickname,
  username,
  password,
  onChangeFullName,
  onChangeNickname,
  onChangeUsername,
  onChangePassword,
  onSubmit,
}: UserInformationFormProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <SquarePen size={13} color="#999" />
        <Text style={styles.headerLabel}>USER INFORMATION</Text>
      </View>

      <Field label="FULL NAME" value={fullName} onChangeText={onChangeFullName} />
      <Field label="NICKNAME" value={nickname} onChangeText={onChangeNickname} />
      <Field label="USERNAME" value={username} onChangeText={onChangeUsername} />
      <Field
        label="PASSWORD"
        value={password}
        onChangeText={onChangePassword}
        secureTextEntry
      />

      <Pressable onPress={onSubmit} style={styles.submitButton}>
        <Save size={16} color="#000" />
        <Text style={styles.submitText}>Update Profile</Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#555"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 16,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 },
  headerLabel: { color: "#999", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  field: { marginBottom: 14 },
  fieldLabel: { color: "#777", fontSize: 10, fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  submitText: { color: "#000", fontSize: 14, fontWeight: "700" },
});
