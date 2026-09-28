import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeviceInfoCard } from "../components/DeviceInfoCard";
import { ProfileAvatarCard } from "../components/ProfileAvatarCard";
import { ProfileHeader } from "../components/ProfileHeader";
import { UserInformationForm } from "../components/UserInformationForm";

// TODO: ganti dengan data asli dari useAuth() dan useBle()/useDevice()
export default function ProfileScreen() {
  const [fullName, setFullName] = useState("Marcus Reyes");
  const [nickname, setNickname] = useState("M-Rex");
  const [username, setUsername] = useState("marcusruns");
  const [password, setPassword] = useState("supersecret");

  const handleUpdateProfile = () => {
    // TODO: panggil use case UpdateProfile lewat useAuth()
    console.log("Update profile:", { fullName, nickname, username });
  };

  const handleDisconnect = () => {
    // TODO: panggil disconnectFromDevice() dari useBle()
    console.log("Disconnect watch");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader />

        <ProfileAvatarCard
          initials="MR"
          fullName={fullName}
          username={username}
          roleBadge="Runner"
        />

        <UserInformationForm
          fullName={fullName}
          nickname={nickname}
          username={username}
          password={password}
          onChangeFullName={setFullName}
          onChangeNickname={setNickname}
          onChangeUsername={setUsername}
          onChangePassword={setPassword}
          onSubmit={handleUpdateProfile}
        />

        <DeviceInfoCard
          isConnected
          batteryPercent={73}
          estimatedRemaining="4h 20min"
          deviceName="Haylou Solar Plus"
          manufacturer="Haylou / Amazfit"
          macAddress="AA:BB:CC:DD:EE:FF"
          firmware="v2.4.1.8"
          bleProtocol="4.2 LE"
          onDisconnect={handleDisconnect}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
});
