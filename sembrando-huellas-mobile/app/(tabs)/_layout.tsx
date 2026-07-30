import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuthStore } from '@/src/stores/authStore';
import { t } from '@/src/i18n';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    index: '🏠',
    news: '📰',
    species: '🌿',
    map: '🗺️',
    more: '⚙️',
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[name] || '📄'}</Text>
  );
}

export default function TabLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#a3a3a3',
        tabBarStyle: {
          borderTopColor: '#e5e5e5',
          backgroundColor: '#ffffff',
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: t('tabs.news'),
          tabBarIcon: ({ focused }) => <TabIcon name="news" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="species"
        options={{
          title: t('tabs.species'),
          tabBarIcon: ({ focused }) => <TabIcon name="species" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('tabs.map'),
          tabBarIcon: ({ focused }) => <TabIcon name="map" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tabs.more'),
          tabBarIcon: ({ focused }) => <TabIcon name="more" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
