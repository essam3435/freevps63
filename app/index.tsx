import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../store/sessionStore';
import { useState, useEffect } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
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
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sessionCardTerminated: {
    borderLeftColor: '#ff3b30',
    opacity: 0.6,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sessionInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  sessionMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  statusBadge: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    gap: 5,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 5,
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
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 3,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default function HomeScreen() {
  const router = useRouter();
  const sessions = useSessionStore((state) => state.sessions);
  const removeSession = useSessionStore((state) => state.removeSession);
  const terminateSessions = useSessionStore((state) => state.terminateSessions);
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());

  const activeSessions = sessions.filter((s) => s.status === 'active');
  const inactiveSessions = sessions.filter((s) => s.status === 'inactive');
  const terminatedSessions = sessions.filter((s) => s.status === 'terminated');

  const handleKillSession = (id: string) => {
    Alert.alert(
      'Terminate Session',
      'Are you sure you want to terminate this session?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Terminate',
          onPress: () => {
            terminateSessions([id]);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleKillOtherSessions = () => {
    const otherSessions = sessions.filter(
      (s) =>
        s.status === 'active' &&
        Date.now() - s.createdAt > 24 * 60 * 60 * 1000
    );
    if (otherSessions.length === 0) {
      Alert.alert('No Sessions', 'No sessions older than 24 hours found.');
      return;
    }
    Alert.alert(
      'Auto Terminate',
      `This will terminate ${otherSessions.length} session(s) older than 24 hours.`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Terminate',
          onPress: () => {
            terminateSessions(otherSessions.map((s) => s.id));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{activeSessions.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{terminatedSessions.length}</Text>
            <Text style={styles.statLabel}>Terminated</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/upload')}
          >
            <Text style={styles.buttonText}>+ Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleKillOtherSessions}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Auto Kill 24h+
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No sessions yet. Upload session files to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.sessionCard,
                item.status === 'terminated' && styles.sessionCardTerminated,
              ]}
            >
              <Text style={styles.sessionName}>{item.name}</Text>
              <Text style={styles.sessionInfo}>Phone: {item.phoneNumber}</Text>
              <Text style={styles.sessionInfo}>App ID: {item.appId}</Text>
              <Text style={styles.sessionInfo}>
                2FA: {item.has2FA ? 'Enabled' : 'Disabled'}
              </Text>

              <View style={styles.statusBadge}>
                <View style={[styles.badge, getStatusColor(item.status)]}>
                  <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
                </View>
                {item.otpCodes.length > 0 && (
                  <View style={[styles.badge, { backgroundColor: '#5856D6' }]}>
                    <Text style={styles.badgeText}>
                      {item.otpCodes.length} OTP
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.sessionMeta}>
                Created: {new Date(item.createdAt).toLocaleString()}
              </Text>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    router.push({
                      pathname: '/details',
                      params: { sessionId: item.id },
                    })
                  }
                >
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    router.push({
                      pathname: '/upload',
                      params: { cloneFrom: item.id },
                    })
                  }
                >
                  <Text style={styles.actionButtonText}>Clone</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#ffebee' }]}
                  onPress={() => handleKillSession(item.id)}
                >
                  <Text style={[styles.actionButtonText, { color: '#ff3b30' }]}>
                    Kill
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}
