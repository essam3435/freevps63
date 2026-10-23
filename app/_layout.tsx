import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';

export default function RootLayout() {
  const autoCleanup = useSessionStore((state) => state.autoCleanupOldSessions);

  useEffect(() => {
    // Auto cleanup sessions older than 24 hours
    const interval = setInterval(() => {
      const terminated = autoCleanup();
      if (terminated.length > 0) {
        console.log(`Auto-terminated ${terminated.length} sessions older than 24 hours`);
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [autoCleanup]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Session Manager',
        }}
      />
      <Stack.Screen
        name="upload"
        options={{
          title: 'Upload Session',
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Session Details',
        }}
      />
    </Stack>
  );
}
