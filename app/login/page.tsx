"use client";

import Logo from "@/components/Logo/Logo";
import {
  BackgroundImage,
  Button,
  Center,
  Divider,
  NavLink,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Text,
  useMantineTheme,
} from "@mantine/core";

export default function LoginPage() {
  const theme = useMantineTheme();

  return (
    <Center
      h="100%"
      w="100%"
      style={{ backgroundColor: theme.colors[theme.primaryColor][0] }}
    >
      <Paper
        p="xl"
        radius={10}
        shadow="xs"
        style={{ minWidth: "min(100%, 500px)" }}
      >
        <form>
          <Stack>
            <Title order={2}>Login</Title>
            <TextInput label="Email" required={true} placeholder="Your email" />
            <PasswordInput
              label="Password"
              required={true}
              placeholder="Your password"
            />
            <NavLink
              href="/forgot-password"
              label={
                <Text c="purple-gray" size="xs">
                  Forgot password?
                </Text>
              }
            />

            <Button type="submit" variant="filled" fullWidth>
              Submit
            </Button>
          </Stack>
        </form>
        <NavLink
          href="/signup"
          label={
            <>
              <Text c="dimmed" size="xs">
                Don't have an account? Sign Up
              </Text>
            </>
          }
          style={{ marginTop: theme.spacing.xs }}
        />
      </Paper>
    </Center>
  );
}
