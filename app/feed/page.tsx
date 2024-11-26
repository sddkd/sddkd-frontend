'use client';

import { AppShell, Burger, Container, Divider, Flex, Title, Text, Blockquote } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { cookies } from 'next/headers';
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react';

function calculateTimeDifference(startedAt: string, timeRequirements: string): string {
  const startTime = new Date(startedAt);

  const [hours, minutes, seconds] = timeRequirements.split(':').map(Number);

  console.log("StartTime: ", startTime)

  startTime.setHours(startTime.getHours() + hours);
  startTime.setMinutes(startTime.getMinutes() + minutes);
  startTime.setSeconds(startTime.getSeconds() + seconds);

  console.log("StartTime AFTER: ", startTime)

  const currentTime = new Date();

  let timeDifferenceMs = 0;
  let isCurrentTimeAfterFinish = false
  if (currentTime > startTime) {
    timeDifferenceMs = currentTime.getTime() - startTime.getTime();
    isCurrentTimeAfterFinish = true
  } 
  else {
    timeDifferenceMs = startTime.getTime() - currentTime.getTime();
  }


  console.log("TimeDifferenceMs: ", timeDifferenceMs)

  const diffSeconds = Math.floor((timeDifferenceMs / 1000) % 60);
  const diffMinutes = Math.floor((timeDifferenceMs / (1000 * 60)) % 60);
  const diffHours = Math.floor((timeDifferenceMs / (1000 * 60 * 60)) % 24);

  return `${isCurrentTimeAfterFinish && "-"}${diffHours.toString().padStart(2, '0')}:${diffMinutes
    .toString()
    .padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
}

function decrementTimeString(timeString: string): string {
  let [hours, minutes, seconds] = timeString.split(':').map(Number);

  const crement = timeString[0] === '-' ? -1 : 1; 

  seconds -= crement;

  if (seconds < 0) {
    seconds = 59;
    minutes -= crement;
  }

  if (minutes < 0) {
    minutes = 59;
    hours -= crement;
  }

  if (seconds > 59) {
    seconds = 0;
    minutes -= crement;
  }

  if (minutes > 59) {
    minutes = 0;
    hours -= crement;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function Feed() {
  const [timeDifference, setTimeDifference] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentTask, setCurrentTask] = useState<any | null>(null);

  const interval = useInterval(() => setTimeDifference(decrementTimeString(timeDifference || "")), 1000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/users-tasks/current-user/', {
      method: 'GET',
      credentials: 'include',
    }).then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
      throw new Error('Failed to get current user tasks');
    }).then((data) => {
      console.log('Current user tasks:', data);
      setCurrentTask(data[0]);
      setTimeDifference(calculateTimeDifference(data[0].started_at, data[0].task.time_requirements));
    }).catch((error) => {
      console.error('Network error or invalid response:', error);
    });
  }
  , []);

  useEffect(() => {
    fetch('http://localhost:8000/api/posts/', {
      method: 'GET',
      credentials: 'include',
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        console.log(resp);
        console.log(resp.text());
        throw new Error('Failed to get posts');
      })
      .then((data) => {
        console.log('Posts:', data);
        setPosts(data);
      })
      .catch((error) => {
        console.error('Network error or invalid response:', error);
      });
  }, []);

  return (
    <Container p="xs" w="100%" h="100%">
      <Flex direction="column">
        {
          currentTask &&
          <>
          <Container w="100%" pb="xl">
            <Blockquote>
              <Text>Your current task: {currentTask.task.name}</Text>
              <Text>Description: {currentTask.task.description}</Text>
              <Text>Time left: {timeDifference}</Text>
            </Blockquote>
          </Container>
          <Divider />
          </>
        }
        
        {
          posts && posts.length > 0 ? 
          posts.map((post) => {
              return (
                <div key={post.id}>
                  <h1>{post.title}</h1>
                  <p>{post.content}</p>
                </div>
              );
          })
          : 
          <Title>No posts...</Title>
        }
      </Flex>

      
    </Container>
  );
}