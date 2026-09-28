import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ProfileAvatarCardProps = {
  initials: string;
  fullName: string;
  username: string;
  roleBadge: string;
};

export function ProfileAvatarCard({
  initials,
  fullName,
  username,
  roleBadge,
}: ProfileAvatarCardProps) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{roleBadge}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#14b8a6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  info: { flex: 1 },
  name: { color: "#fff", fontSize: 15, fontWeight: "700" },
  username: { color: "#777", fontSize: 12, marginTop: 2 },
  badge: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: { color: "#ccc", fontSize: 11, fontWeight: "600" },
});
