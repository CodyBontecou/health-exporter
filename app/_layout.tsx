import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../src/theme';
import { healthKitManager, vaultManager, schedulingManager } from '../src/managers';
import { useAppStore } from '../src/stores';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setInitialized = useAppStore((state) => state.setInitialized);
  const setHealthKitAuthorized = useAppStore((state) => state.setHealthKitAuthorized);
  const setHasVaultSelected = useAppStore((state) => state.setHasVaultSelected);

  useEffect(() => {
    async function initialize() {
      try {
        // Initialize all managers
        const [healthKitAuth] = await Promise.all([
          healthKitManager.initialize(),
          vaultManager.initialize(),
          schedulingManager.initialize(),
        ]);

        // Update app state
        setHealthKitAuthorized(healthKitAuth);
        setHasVaultSelected(vaultManager.hasVaultSelected());
        setInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setInitialized(true);
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    initialize();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Health Exporter',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Export Settings',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="schedule"
          options={{
            title: 'Scheduled Exports',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
