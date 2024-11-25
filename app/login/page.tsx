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
import { useForm } from '@mantine/form';
import { useState, useEffect } from "react";



export default function LoginPage() {
  const theme = useMantineTheme();
  const [failedToLogin, setFailedToLogin] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const login = async (formData: any) => {
    fetch("http://localhost:8000/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        throw new Error("Failed to login");
      })
      .then((data) => {
        console.log("Login successful:", data);
        window.location.href = "/feed";
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch((error) => {
        console.error("Network error or invalid response:", error);
        setFailedToLogin(true);
      });
    
      
    // if (!resp.ok) {
    //   setFailedToLogin(true);
    // }
  }

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
            <TextInput label="Email" required={true} placeholder="Your email"  key={form.key("email")} {...form.getInputProps("email")} />
            <PasswordInput
              label="Password"
              required={true}
              placeholder="Your password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            {/* <NavLink
              href="/forgot-password"
              label={
                <Text c="purple-gray" size="xs">
                  Forgot password?
                </Text>
              }
            /> */}
            {failedToLogin && (
              <Text c="red" size="sm">
                Invalid email or password
              </Text>
            )}
            
            <Button variant="filled" fullWidth onClick={() => login(form.getValues())}>
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
