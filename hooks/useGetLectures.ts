import { GetLecturesQuery, GetLecturesQueryVariables, Lecture } from '@/apollo/__generated__/graphql';
import { SortOrder } from '@/apollo/__generated__/graphql';
import { GET_LECTURES } from '@/apollo/queries/lectures';
import { useApolloClient, useQuery } from "@apollo/client";
import { useAuth } from './useAuth';

export const useGetLectures = ({ skip, input}: { skip?: boolean, input?: GetLecturesQueryVariables['input'] } = {}) => {
  const apolloClient = useApolloClient();  
  const variables = {
    input,
    pagination: {
      limit: 15,
      sort: [{
        by: 'createdAt',
        order: SortOrder.Desc
      }]
    }
  }

  const { data: { lectures: { items = [], pageInfo } = { items: [], pageInfo: { next: null } } } = {}, loading: isLoading, fetchMore } =
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

  const fetchMoreLectures = async () => {
    if (!pageInfo?.next) {
      return;
    }

    await fetchMore({
      variables: {
        pagination: {
          ...variables.pagination,
          next: pageInfo?.next
        }
      }
    });
  }

  return {
    items,
    isLoading,
    updateCreatingLectureCache: handleCache,
    fetchMore: fetchMoreLectures
  };
};
