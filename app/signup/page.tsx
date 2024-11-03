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
  Stepper,
  Group,
  Chip,
  MultiSelect,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";

const topics = ["⛩️ Anime", "⚽ Sport", "🌳 Nature", "🏛️ Architecture"];

export default function SignUpPage() {
  const theme = useMantineTheme();
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSkillLevelChipClick = (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.value === skillLevel) {
      setSkillLevel(null);
    }
  };

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
          <Title order={2} mb="xl">
            Sign Up
          </Title>
          <Stepper active={active} allowNextStepsSelect={false}>
            <Stepper.Step label="Required" onClick={() => setActive(0)}>
              <Stack>
                <TextInput
                  label="Username"
                  required={true}
                  placeholder="Your username"
                />
                <TextInput
                  label="Email"
                  required={true}
                  placeholder="Your email"
                />
                <PasswordInput
                  label="Password"
                  required={true}
                  placeholder="Your password"
                />
                <PasswordInput
                  label="Confirm Password"
                  required={true}
                  placeholder="Confirm your password"
                />
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Optional" onClick={() => setActive(1)}>
              <Stack>
                <TextInput label="First Name" placeholder="Your first name" />
                <TextInput label="Last Name" placeholder="Your last name" />
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Personalization" onClick={() => setActive(2)}>
              <Stack>
                <DatePickerInput
                  required={true}
                  label="Date of Birth"
                  placeholder="Your date of birth"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                />
                <Group>
                  <Chip.Group
                    multiple={false}
                    value={skillLevel}
                    onChange={setSkillLevel}
                  >
                    <Text fw={500}>What's your skill level? <Text span c="red">*</Text></Text>
                    <Chip value="beginner" onClick={handleSkillLevelChipClick}>
                      Beginner
                    </Chip>
                    <Chip
                      value="intermediate"
                      onClick={handleSkillLevelChipClick}
                    >
                      Intermediate
                    </Chip>
                    <Chip value="pro" onClick={handleSkillLevelChipClick}>
                      Pro
                    </Chip>
                  </Chip.Group>
                </Group>
                <MultiSelect
                  label="Which topics are you interested in?"
                  data={topics}
                  placeholder="Select topics"
                  clearable
                  searchable
                  required={true}
                  style={{maxWidth: "500px"}}
                />
              </Stack>
            </Stepper.Step>
          </Stepper>
          <Group justify="center" mt="xl">
            <Button onClick={prevStep} variant="default">
              Back
            </Button>
            {active == 2 ? (
              <Button variant="filled">
                Submit
              </Button>
            ) : (
              <Button onClick={nextStep} variant="filled">
                Next
              </Button>
            )}
          </Group>
        </form>
        <NavLink
          href="/login"
          label={
            <>
              <Text c="dimmed" size="xs">
                Already have an account? Login
              </Text>
            </>
          }
          style={{ marginTop: theme.spacing.xs }}
        />
      </Paper>
    </Center>
  );
}
