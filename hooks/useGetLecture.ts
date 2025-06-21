import { Lecture } from '@/apollo/__generated__/graphql';
import { GET_LECTURE } from '@/apollo/queries/lectures';
import { useQuery } from '@apollo/client';

export const useGetLecture = (lectureId: string) => {
  const { data: { lecture } = {}, loading } = useQuery(GET_LECTURE, {
    variables: {
      id: lectureId as string,
    },
    skip: !lectureId,
    onError: (error) => {
      console.log('GET_LECTURE error', error);
    }
  });

  return {
    lecture: lecture as Lecture,
    loading,
  }
}