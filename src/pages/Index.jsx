import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Link, Spinner, Box, Heading } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json");
        const storyIds = await response.json();
        const topTenStoryIds = storyIds.slice(0, 10);

        const storyPromises = topTenStoryIds.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return await storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="hn.500">
          Latest Hacker News CLIENT
        </Heading>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          stories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
              <Heading as="h2" size="md" mb={2}>
                <Link href={story.url} isExternal color="hn.500">
                  {story.title} <FaExternalLinkAlt />
                </Link>
              </Heading>
              <Text>By: {story.by}</Text>
              <Text>Score: {story.score}</Text>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;
