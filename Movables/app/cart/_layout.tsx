import { Stack } from 'expo-router';
import Header from '../../components/Header';

export default function CartLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ navigation, options }) => (
          <Header title={options.title as string} />
        ),
      }}
    />
  );
}
