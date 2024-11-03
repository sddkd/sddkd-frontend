"use client";

import "@mantine/core/styles.css";

import React from "react";
import {
  ColorSchemeScript,
  MantineProvider,
  AppShell,
  Burger,
  NavLink,
  Flex,
  Button,
  Avatar,
  Container,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconNotification, IconSettings } from "@tabler/icons-react";
import { theme } from "../../theme";

export default function FeedLayout({ children }: { children: any }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        // padding="md"
      >
        <AppShell.Header p="md" display="flex">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Flex direction="row" align="center" justify="flex-start" w="100%">
            <b>SDDKD</b>

            <Button ml="auto">
                <b>Get new task</b>
            </Button>
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar>
          <Flex
            direction="column"
            style={{ height: "100%", width: "100%" }}
            justify="flex-start"
            align="flex-start"
          >
            <Container w="100%">
              <NavLink href="/feed" label="Feed" leftSection={<IconHome />} />
              <NavLink
                href="/notifications"
                label="Notifications"
                leftSection={<IconNotification />}
              />
              <NavLink
                href="/settings"
                label="Settings"
                leftSection={<IconSettings />}
              />
            </Container>

            <Container w="100%" mt="auto" style={{ marginTop: "auto" }} p="md">
              <Divider />
              <Flex mt="1rem">
                <Avatar size="md" radius="xl" src="https://i.pravatar.cc/300" />
                <Flex direction="column" ml="md">
                  <b>Maria Korsefighter</b>
                  @username
                </Flex>
              </Flex>
            </Container>
          </Flex>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
