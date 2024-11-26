"use client";

import {
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function createTask(formData: any) {
  let resp = await fetch(
    "http://localhost:8000/api/users-tasks/create-user-task/",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: parseInt(formData.task),
        user: -1,
      }),
    }
  );

  if (resp.ok) {
    return await resp.json();
  }
}

export function CreateTaskForm(props: any) {
  const [topics, setTopic] = useState<any>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      topic: "",
      task: "",
    },
    validate: (values) => {
      const errors: any = {};
      return errors;
    },
  });

  useEffect(() => {
    const preprocessTopics = (topics: any[]) => {
      return topics.map((topic) => {
        return {
          label: topic.name,
          value: `${topic.id}`,
        };
      });
    };

    fetch("http://localhost:8000/api/topics/", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setTopic(preprocessTopics(data)));
  }, []);

  useEffect(() => {
    if (!form.getValues()["topic"]) {
      return;
    }

    const preprocessTasks = (tasks: any[]) => {
      return tasks.map((task) => {
        return {
          label: task.name,
          value: `${task.id}`,
        };
      });
    };

    fetch(
      `http://localhost:8000/api/tasks/topic/${form.getValues()["topic"]}/`,
      {
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => setTasks(preprocessTasks(data)));
  }, [form.getValues()["topic"]]);

  return (
    <Stack>
      <Select
        label="Which topic would you like to draw?"
        data={topics}
        placeholder="Select a topic"
        clearable
        searchable
        required={true}
        style={{ maxWidth: "500px" }}
        key={form.key("topic")}
        {...form.getInputProps("topic")}
      />

      <Select
        label="Which task would you like to draw?"
        data={tasks}
        placeholder="Select a task"
        clearable
        searchable
        required={true}
        style={{ maxWidth: "500px" }}
        key={form.key("task")}
        {...form.getInputProps("task")}
      />

      <Button
        onClick={() => {
          createTask(form.getValues());
          props.closeModal();
          notifications.show({
            title: "Task created",
            message: "You have successfully created a new task, reload the page to see it",
            color: "teal",
          });
        }}
      >
        Create Task
      </Button>
    </Stack>
  );
}
