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
import { useRouter } from 'next/navigation';
import { DatePickerInput } from "@mantine/dates";
import { useState, useEffect } from "react";
import { useForm } from '@mantine/form';

// const topics = ["⛩️ Anime", "⚽ Sport", "🌳 Nature", "🏛️ Architecture"];

function convertDrawingSpeed(speed: string) {
  switch (speed) {
    case "slow":
      return "01:00:00";
    case "medium":
      return "00:30:00";
    case "fast":
      return "00:15:00";
    default:
      return null;
  }
}

function sendRegisterRequest(data: any) {
  console.log(data);
  return fetch("http://localhost:8000/auth/registration/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      password1: data.password1,
      password2: data.password2,
      first_name: data.first_name,
      last_name: data.last_name,
      profile: {
        date_of_birth: data.dateOfBirth.toISOString().split('T')[0],
        skill_level: data.skillLevel,
        time_requirements: convertDrawingSpeed(data.drawingSpeed),
        topics: data.topics || [],
      },
    }),
  });
}

export default function SignUpPage() {
  const router = useRouter();

  const theme = useMantineTheme();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      email: "",
      password1: "",
      password2: "",
      first_name: "",
      last_name: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (active === 0) {
        if (values.password1 !== values.password2) {
          errors.password2 = "Passwords do not match";
        }
        if (values.email !== "" && !values.email.includes("@")) {
          errors.email = "Invalid email";
        }

        if (values.password1.length < 8) {
          errors.password1 = "Password is too short";
        }
        if (!values.password1.match(/[A-Z]/)) {
          errors.password1 = "Password must contain at least one uppercase letter";
        }
        if (!values.password1.match(/[a-z]/)) {
          errors.password1 = "Password must contain at least one lowercase letter";
        }
        if (!values.password1.match(/[0-9]/)) {
          errors.password1 = "Password must contain at least one number";
        }
        
      }

      return errors;
    } 
  },
);

  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    const preprocessTopics = (topics: any[]) => {
      return topics.map((topic) => {
        return {
          label: topic.name,
          value: `${topic.id}`,
        };
      });
    }

    fetch("http://localhost:8000/api/topics/")
      .then((response) => response.json())
      .then((data) => setTopics(preprocessTopics(data)));
  }, []);

  useEffect(() => {
    console.log(topics);
  }
  , [topics]);

  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [drawingSpeed, setDrawingSpeed] = useState<string | null>(null);

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }

      return current < 2 ? current + 1 : current
    }
  );
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSkillLevelChipClick = (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.value === skillLevel) {
      setSkillLevel(null);
    }
  };

  const handleDrawingSpeedChipClick = (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.value === drawingSpeed) {
      setDrawingSpeed(null);
    }
  }

  const handleSubmit = async () => {
    let resp = await sendRegisterRequest({...form.getValues()})
    if (resp.ok) {
      console.log("Success");
      router.push("/login");
    } else {
      let data = await resp.json();
      console.log(data);
    }
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
                  key={form.key("username")}
                  {...form.getInputProps("username")}
                />
                <TextInput
                  label="Email"
                  required={true}
                  placeholder="Your email"
                  key={form.key("email")}
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  required={true}
                  placeholder="Your password"
                  key={form.key("password")}
                  {...form.getInputProps("password1")}
                />
                <PasswordInput
                  label="Confirm Password"
                  required={true}
                  placeholder="Confirm your password"
                  key={form.key("confirmPassword")}
                  {...form.getInputProps("password2")}
                />
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Optional" onClick={() => setActive(1)}>
              <Stack>
                <TextInput label="First Name" placeholder="Your first name" key={form.key("first_name")} {...form.getInputProps("first_name")} />
                <TextInput label="Last Name" placeholder="Your last name" key={form.key("last_name")} {...form.getInputProps("last_name")} />
              </Stack>
            </Stepper.Step>
            <Stepper.Step label="Personalization" onClick={() => setActive(2)}>
              <Stack>
                <DatePickerInput
                  required={true}
                  label="Date of Birth"
                  placeholder="Your date of birth"
                  key={form.key("dateOfBirth")}
                  {...form.getInputProps("dateOfBirth")}
                />
                <Group>
                  <Chip.Group
                    multiple={false}
                    key={form.key("drawingSpeed")}
                    {...form.getInputProps("drawingSpeed")}
                  >
                    <Text fw={500}>How fast do you draw?</Text>
                    <Chip value="slow" onClick={handleDrawingSpeedChipClick}>
                      Slow
                    </Chip>
                    <Chip value="medium" onClick={handleSkillLevelChipClick}>
                      Medium
                    </Chip>
                    <Chip value="fast" onClick={handleSkillLevelChipClick}>
                      Fast
                    </Chip>
                  </Chip.Group>
                </Group>
                <Group>
                  <Chip.Group
                    multiple={false}
                    key={form.key("skillLevel")}
                    {...form.getInputProps("skillLevel")}
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
                  key={form.key("topics")}
                  {...form.getInputProps("topics")}
                />
              </Stack>
            </Stepper.Step>
          </Stepper>
          <Group justify="center" mt="xl">
            <Button onClick={prevStep} variant="default">
              Back
            </Button>
            {active == 2 ? (
              <Button variant="filled" onClick={() => handleSubmit()}>
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
