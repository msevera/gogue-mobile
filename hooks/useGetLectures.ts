import { FindLecturesInput, GetLecturesQuery, GetLecturesQueryVariables, Lecture } from '@/apollo/__generated__/graphql';
import { SortOrder } from '@/apollo/__generated__/graphql';
import { GET_LECTURES } from '@/apollo/queries/lectures';
import { useApolloClient, useQuery } from "@apollo/client";

export const useGetLectures = ({ skip, input }: { skip?: boolean, input?: FindLecturesInput } = {}) => {
  const apolloClient = useApolloClient();
  const { data: { lectures: { items = [] } = { items: [] } } = {}, loading: isLoading } = useQuery<GetLecturesQuery, GetLecturesQueryVariables>(GET_LECTURES, {
    variables: {
      input,
      pagination: {
        sort: [{
          by: 'createdAt',
          order: SortOrder.Desc
        }]
      }
    },
    skip,
    onError: (error) => {
      console.log('error', error)
    }
  });

  const handleCache = (newLecture: Lecture) => {
    const buildQueryParams = (params?: any) => {
      return {
        ...params,
        pagination: {
          sort: [{
            by: 'createdAt',
            order: SortOrder.Desc
          }]
        }
      }
    }

    const updateFn = (data: any) => {
      const doesLectureExist = data?.lectures?.items?.some((lecture: Lecture) => lecture.id === newLecture.id || lecture.id === undefined);
      const items = doesLectureExist ?
        data?.lectures?.items?.map((lecture: Lecture) => lecture.id === newLecture.id || lecture.id === undefined ? newLecture : lecture) :
        [newLecture, ...data?.lectures?.items];

      return {
        ...data,
        lectures: {
          ...data?.lectures,
          items: [...items].filter(Boolean)
        }
      }
    }

    apolloClient.cache.updateQuery<GetLecturesQuery, GetLecturesQueryVariables>(
      {
        query: GET_LECTURES,
        variables: buildQueryParams()
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
