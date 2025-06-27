import { GetLecturesQuery, GetLecturesQueryVariables, Lecture } from '@/apollo/__generated__/graphql';
import { SortOrder } from '@/apollo/__generated__/graphql';
import { GET_LECTURES } from '@/apollo/queries/lectures';
import { useApolloClient, useQuery } from "@apollo/client";
import { useAuth } from './useAuth';

export const useGetLectures = ({ skip }: { skip?: boolean } = {}) => {
  const apolloClient = useApolloClient();
  const { authUser } = useAuth();
  const variables = {
    input: {
      skipUserId: authUser?.id
    },
    pagination: {
      limit: 15,
      sort: [{
        by: 'createdAt',
        order: SortOrder.Desc
      }]
    }
  }

  const { data: { lectures: { items = [] } = { items: [] } } = {}, loading: isLoading } =
    useQuery<GetLecturesQuery, GetLecturesQueryVariables>(GET_LECTURES, {
      variables,
      skip,
      onError: (error) => {
        console.log('error', JSON.stringify(error, null, 2))
      }
    });

  const handleCache = (newLecture: Lecture) => {
    const updateFn = (data: any) => {
      const lectures = data?.lectures;
      const doesLectureExist = lectures?.items?.some((lecture: Lecture) => lecture.id === newLecture.id || lecture.id === undefined);
      const items = doesLectureExist ?
        lectures?.items?.map((lecture: Lecture) => lecture.id === newLecture.id || lecture.id === undefined ? newLecture : lecture) :
        [newLecture, ...lectures?.items];

      return {
        ...data,
        lectures: {
          ...lectures,
          items: [...items].filter(Boolean)
        }
      }
    }

    apolloClient.cache.updateQuery<GetLecturesQuery, GetLecturesQueryVariables>(
      {
        query: GET_LECTURES,
        variables
      },
      (data) => updateFn(data)
    );
  }

  return {
    items,
    isLoading,
    updateCreatingLectureCache: handleCache
  };
};
