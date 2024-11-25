'use client';

import { AppShell, Burger, Container, Flex, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { cookies } from 'next/headers';
import { useEffect, useState } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);

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