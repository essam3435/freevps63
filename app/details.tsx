import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSessionStore } from '../store/sessionStore';
import { useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusBadge: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: '#34C759',
  },
  inactiveBadge: {
    backgroundColor: '#FF9500',
  },
  terminatedBadge: {
    backgroundColor: '#ff3b30',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  otpContainer: {
    marginTop: 15,
  },
  otpInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  otpList: {
    marginTop: 12,
  },
  otpCode: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otpCodeText: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#333',
  },
  copyButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  copyButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  actionButtons: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  dangerButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#333',
  },
  addButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sessionId = params.sessionId as string;

  const session = useSessionStore((state) =>
    state.sessions.find((s) => s.id === sessionId)
  );
  const addOTPCode = useSessionStore((state) => state.addOTPCode);
  const terminateSessions = useSessionStore((state) => state.terminateSessions);
  const removeSession = useSessionStore((state) => state.removeSession);

  const [otpInput, setOtpInput] = useState('');

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Session not found</Text>
      </View>
    );
  }

  const handleAddOTP = () => {
    if (!otpInput.trim()) {
      Alert.alert('Error', 'Please enter an OTP code');
      return;
    }
    addOTPCode(sessionId, otpInput.trim());
    setOtpInput('');
    Alert.alert('Success', 'OTP code added');
  };

  const handleKillSession = () => {
    Alert.alert(
      'Terminate Session',
      'Are you sure you want to terminate this session?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Terminate',
          onPress: () => {
            terminateSessions([sessionId]);
            Alert.alert('Session Terminated', 'The session has been terminated.', [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleClone = () => {
    router.push({
      pathname: '/upload',
      params: { cloneFrom: sessionId },
    });
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'active':
        return styles.activeBadge;
      case 'inactive':
        return styles.inactiveBadge;
      case 'terminated':
        return styles.terminatedBadge;
      default:
        return styles.inactiveBadge;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.sessionTitle}>{session.name}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.badge, getStatusColor()]}>
            <Text style={styles.badgeText}>{session.status.toUpperCase()}</Text>
          </View>
          {session.has2FA && (
            <View style={[styles.badge, { backgroundColor: '#FF9500' }]}>
              <Text style={styles.badgeText}>2FA</Text>
            </View>
          )}
        </View>
      </View>

      {/* Session Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone Number</Text>
          <Text style={styles.infoValue}>{session.phoneNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App ID</Text>
          <Text style={styles.infoValue}>{session.appId}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>API Hash</Text>
          <Text style={styles.infoValue}>{session.apiHash}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created At</Text>
          <Text style={styles.infoValue}>
            {new Date(session.createdAt).toLocaleString()}
          </Text>
        </View>

        {session.lastUsed && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Used</Text>
            <Text style={styles.infoValue}>
              {new Date(session.lastUsed).toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {/* OTP Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OTP Codes</Text>

        <TextInput
          style={styles.otpInput}
          placeholder="Paste OTP code here"
          value={otpInput}
          onChangeText={setOtpInput}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddOTP}>
          <Text style={styles.addButtonText}>+ Add OTP Code</Text>
        </TouchableOpacity>

        {session.otpCodes.length === 0 ? (
          <Text style={styles.emptyText}>No OTP codes saved yet</Text>
        ) : (
          <View style={styles.otpList}>
            {session.otpCodes.map((code, index) => (
              <View key={index} style={styles.otpCode}>
                <Text style={styles.otpCodeText}>{code}</Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleClone}
        >
          <Text style={styles.buttonText}>Clone</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleKillSession}
        >
          <Text style={styles.buttonText}>Kill</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
