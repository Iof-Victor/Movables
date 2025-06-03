import { Stack } from "expo-router";
import Header from "../../components/Header";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ navigation, options }) => <Header title={"Home"} />,
      }}
    />
  );
}
