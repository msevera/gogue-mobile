import { Lecture } from '@/apollo/__generated__/graphql';
import { DocumentNode, useQuery } from '@apollo/client';

export const useGetLecture = (slug: string, query: DocumentNode) => {
  const { data: { lectureBySlug: lecture } = {}, loading } = useQuery(query, {
    variables: {
      slug: slug as string,
    },
    skip: !slug,
    onError: (error) => {
      console.log('GET_LECTURE error', JSON.stringify(error, null, 2));
    }
  });

  return {
    lecture: lecture as Lecture,
    loading,
  }
}