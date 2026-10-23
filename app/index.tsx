import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../store/sessionStore';
import { useState, useEffect } from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 0,
  },
  tabLabel: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
  tabLabelActive: {
    color: '#007AFF',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 6,
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
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    elevation: 2,
  },
  sessionCardTerminated: {
    borderLeftColor: '#ff3b30',
    opacity: 0.6,
  },
  sessionName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  sessionInfo: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  statusBadge: {
    flexDirection: 'row',
    marginTop: 7,
    gap: 3,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 3,
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
    fontSize: 10,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 10,
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
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 8,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
    marginTop: 12,
    marginBottom: 8,
  },
});

// Sessions Tab
function SessionsTab() {
  const router = useRouter();
  const sessions = useSessionStore((state) => state.sessions);
  const removeSession = useSessionStore((state) => state.removeSession);
  const terminateSessions = useSessionStore((state) => state.terminateSessions);

  const activeSessions = sessions.filter((s) => s.status === 'active');
  const inactiveSessions = sessions.filter((s) => s.status === 'inactive');
  const terminatedSessions = sessions.filter((s) => s.status === 'terminated');

  const handleKillSession = (id: string) => {
    Alert.alert('Terminate Session', 'Kill this session?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Kill',
        onPress: () => terminateSessions([id]),
        style: 'destructive',
      },
    ]);
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
      'Auto Kill 24h+',
      `Kill ${otherSessions.length} session(s)?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Kill',
          onPress: () => terminateSessions(otherSessions.map((s) => s.id)),
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.statLabel}>Dead</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/upload')}
          >
            <Text style={styles.buttonText}>+ Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleKillOtherSessions}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Kill 24h+
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No sessions yet. Add one to start.</Text>
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
              <Text style={styles.sessionInfo}>{item.phoneNumber}</Text>
              <Text style={styles.sessionInfo}>ID: {item.appId}</Text>

              <View style={styles.statusBadge}>
                <View style={[styles.badge, getStatusColor(item.status)]}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
                {item.otpCodes.length > 0 && (
                  <View style={[styles.badge, { backgroundColor: '#5856D6' }]}>
                    <Text style={styles.badgeText}>{item.otpCodes.length}📱</Text>
                  </View>
                )}
              </View>

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
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ScrollView>
  );
}

// Tools Tab
function ToolsTab() {
  const sessions = useSessionStore((state) => state.sessions);
  const router = useRouter();

  const tools = [
    { icon: '🔍', title: 'Check Spam', action: () => Alert.alert('Check Spam', 'Check if accounts are spam') },
    { icon: '📱', title: 'Read Codes', action: () => Alert.alert('Read OTP', 'View all OTP codes') },
    { icon: '🔐', title: '2FA Manager', action: () => Alert.alert('2FA', 'Manage 2FA settings') },
    { icon: '💬', title: 'Send Message', action: () => Alert.alert('Message', 'Send messages from sessions') },
    { icon: '⚡', title: 'Kill Sessions', action: () => router.push('/') },
    { icon: '✅', title: 'Validate', action: () => Alert.alert('Validate', 'Validate session accounts') },
    { icon: '📊', title: 'Account Info', action: () => Alert.alert('Info', 'Get user information') },
    { icon: '🧹', title: 'Account Clean', action: () => Alert.alert('Clean', 'Clean inactive accounts') },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          Tools ({sessions.length} sessions)
        </Text>
      </View>
      <View style={styles.featureGrid}>
        {tools.map((tool, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.featureCard}
            onPress={tool.action}
          >
            <Text style={styles.featureIcon}>{tool.icon}</Text>
            <Text style={styles.featureTitle}>{tool.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// Stats Tab
function StatsTab() {
  const sessions = useSessionStore((state) => state.sessions);

  const activeSessions = sessions.filter((s) => s.status === 'active').length;
  const inactiveSessions = sessions.filter((s) => s.status === 'inactive').length;
  const terminatedSessions = sessions.filter((s) => s.status === 'terminated').length;
  const totalOTPCodes = sessions.reduce((sum, s) => sum + s.otpCodes.length, 0);
  const accounts2FA = sessions.filter((s) => s.has2FA).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
          📊 Statistics
        </Text>
      </View>

      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📱</Text>
          <Text style={styles.featureTitle}>Total Sessions</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginTop: 4 }}>
            {sessions.length}
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureTitle}>Active</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#34C759', marginTop: 4 }}>
            {activeSessions}
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>⚠️</Text>
          <Text style={styles.featureTitle}>Inactive</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF9500', marginTop: 4 }}>
            {inactiveSessions}
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>💀</Text>
          <Text style={styles.featureTitle}>Terminated</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ff3b30', marginTop: 4 }}>
            {terminatedSessions}
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📝</Text>
          <Text style={styles.featureTitle}>OTP Codes</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#5856D6', marginTop: 4 }}>
            {totalOTPCodes}
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🔐</Text>
          <Text style={styles.featureTitle}>2FA Enabled</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF9500', marginTop: 4 }}>
            {accounts2FA}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Main component
export default function HomeScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'sessions', title: '📱 Sessions', icon: '📱' },
    { key: 'tools', title: '🛠️ Tools', icon: '🛠️' },
    { key: 'stats', title: '📊 Stats', icon: '📊' },
  ]);

  const renderScene = SceneMap({
    sessions: SessionsTab,
    tools: ToolsTab,
    stats: StatsTab,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={styles.tabBar}
          indicatorStyle={{ backgroundColor: '#007AFF' }}
          labelStyle={styles.tabLabel}
          activeColor="#007AFF"
          inactiveColor="#999"
        />
      )}
      sceneContainerStyle={{ backgroundColor: '#f5f5f5' }}
    />
  );
}
