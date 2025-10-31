import { GetLectureDetailsQuery, GetLectureDetailsQueryVariables, Lecture } from '@/apollo/__generated__/graphql';
import { DocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export const useGetLecture = (slug: string, query: DocumentNode) => {
  const { authUser } = useAuth();
  const { data: { lectureBySlug: lecture } = {}, loading, refetch } = useQuery<GetLectureDetailsQuery, GetLectureDetailsQueryVariables>(query, {
    variables: {
      slug: slug as string,
    },
    skip: !slug
  });


  // useEffect(() => {
  //   refetch();
  // }, [authUser?.id]);

  return {
    lecture: lecture as Lecture,
    loading,
  }
}