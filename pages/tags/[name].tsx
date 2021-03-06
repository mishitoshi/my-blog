import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import {
  Box,
  List,
  Divider,
  Container,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PageLink } from '../../components/PageLink';
import { PageObject } from '../../lib/notion/types';
import { getPosts } from '../../lib/notion';
import Link from 'next/link';
import { Head } from '../../components/Head';
import React from 'react';

type Props = {
  pages: PageObject[];
  tagName: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const tagName = query.name as string;

  const data = await getPosts({
    filter: {
      and: [
        {
          property: 'Publish',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Tags',
          multi_select: {
            contains: tagName,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'CreatedAt',
        direction: 'descending',
      },
    ],
  });

  return { props: { pages: data, tagName } };
};

const TagPage: NextPage<Props> = ({ pages, tagName }) => {
  return (
    <Box minH={'100vh'} backgroundColor={'gray.100'}>
      <Head>
        <title>{`${tagName}の記事一覧 - mishitoshi's blog`}</title>
      </Head>
      <Container>
        <Header></Header>
        <Box>
          <VStack align={'center'} mb={4} spacing={2}>
            <Heading as={'h1'} size={'lg'}>
              {tagName}
            </Heading>
          </VStack>
          <List spacing={3}>
            {pages.map((page) => (
              <React.Fragment key={page['id']}>
                <Divider />
                <PageLink page={page}></PageLink>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Container>
      <Footer></Footer>
    </Box>
  );
};

export default TagPage;
