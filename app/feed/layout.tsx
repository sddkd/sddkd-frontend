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
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconNotification, IconSettings } from "@tabler/icons-react";
import { theme } from "../../theme";
import Logo from "@/components/Logo/Logo";
import { useEffect } from "react";
import { CreateTaskForm } from "@/components/CreateTaskForm/CreateTaskForm";

export default function FeedLayout({ children }: { children: any }) {
  const [opened, { toggle }] = useDisclosure();

  const [createTaskOpened, { open, close }] = useDisclosure(false);

  const [user, setUser] = React.useState<any | null>(null);

  useEffect(() => {
    // get user from local storage
    const userLS = localStorage.getItem("user");
    if (userLS === null) {
      window.location.href = "/login";
    } else {
      console.log(userLS);

      setUser(JSON.parse(userLS));
    }
  }, []);

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
            <Logo />
            <Modal opened={createTaskOpened} onClose={close} title="Create a new task">
              <CreateTaskForm close={close} />
            </Modal>
            <Button onClick={open} ml="auto">
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

            {user && (
              <Container
                w="100%"
                mt="auto"
                style={{ marginTop: "auto" }}
                p="md"
              >
                <Divider />
                <Flex mt="1rem">
                  <Avatar
                    size="md"
                    radius="xl"
                    name={user.username}
                    color="initials"
                  />
                  <Flex direction="column" ml="md">
                    <b>{user.first_name} {user.last_name}</b>
                    @{user.username}
                    {/* logout button */}
                    <Button
                      variant="light"
                      onClick={() => {
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                        fetch("http://localhost:8000/api/auth/logout/", {
                          method: "POST",
                        }
                        )
                      }}
                    >
                      Logout
                      </Button>
                  </Flex>
                </Flex>
              </Container>
            )}
          </Flex>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
