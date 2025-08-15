import { Lecture } from '@/apollo/__generated__/graphql';
import { DocumentNode, useQuery } from '@apollo/client';

export const useGetLecture = (lectureId: string, query: DocumentNode) => {
  const { data: { lecture } = {}, loading } = useQuery(query, {
    variables: {
      id: lectureId as string,
    },
    skip: !lectureId,
    onError: (error) => {
      console.log('GET_LECTURE error', JSON.stringify(error, null, 2));
    }
  });

  return {
    lecture: lecture as Lecture,
    loading,
  }
}