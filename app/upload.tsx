import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSessionStore, Session } from '../store/sessionStore';
import { useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#007AFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  fileList: {
    marginTop: 15,
  },
  fileItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  removeButton: {
    padding: 5,
  },
  removeText: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#d0d0d0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  note: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    borderRadius: 6,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default function UploadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cloneFrom = params.cloneFrom as string | undefined;

  const addSession = useSessionStore((state) => state.addSession);
  const getSession = useSessionStore((state) =>
    state.sessions.find((s) => s.id === cloneFrom)
  );

  const [sessionName, setSessionName] = useState(
    cloneFrom && getSession ? `${getSession.name} (Clone)` : ''
  );
  const [phoneNumber, setPhoneNumber] = useState(
    cloneFrom && getSession ? getSession.phoneNumber : ''
  );
  const [appId, setAppId] = useState(
    cloneFrom && getSession ? getSession.appId : ''
  );
  const [apiHash, setApiHash] = useState(
    cloneFrom && getSession ? getSession.apiHash : ''
  );
  const [has2FA, setHas2FA] = useState(
    cloneFrom && getSession ? getSession.has2FA : false
  );
  const [loading, setLoading] = useState(false);

  const handleAddSession = async () => {
    if (!sessionName.trim() || !phoneNumber.trim() || !appId.trim() || !apiHash.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const newSession: Session = {
        id: `session_${Date.now()}`,
        name: sessionName.trim(),
        phoneNumber: phoneNumber.trim(),
        appId: appId.trim(),
        apiHash: apiHash.trim(),
        has2FA,
        createdAt: Date.now(),
        status: 'active',
        otpCodes: [],
      };

      addSession(newSession);
      Alert.alert(
        'Success',
        `Session "${sessionName}" created successfully!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create session. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <View style={styles.note}>
          <Text style={styles.noteTitle}>📝 File Format</Text>
          <Text style={styles.noteText}>
            Upload your Telethon session (.json) and session file. They should have the same phone number. Telethon file should end with _telethon.
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Session Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Main Account"
            value={sessionName}
            onChangeText={setSessionName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1234567890"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>App ID</Text>
          <TextInput
            style={styles.input}
            placeholder="From credentials.json"
            value={appId}
            onChangeText={setAppId}
            placeholderTextColor="#999"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>API Hash</Text>
          <TextInput
            style={styles.input}
            placeholder="From credentials.json"
            value={apiHash}
            onChangeText={setApiHash}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <View style={styles.checkboxGroup}>
            <TouchableOpacity
              style={[styles.checkbox, has2FA && styles.checkboxChecked]}
              onPress={() => setHas2FA(!has2FA)}
            >
              {has2FA && <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>This account has 2FA enabled</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleAddSession}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {cloneFrom ? 'Clone Session' : 'Create Session'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
