import { GetLecturesRecentlyPlayedQuery, GetLecturesRecentlyPlayedQueryVariables, Lecture } from '@/apollo/__generated__/graphql';
import { GET_LECTURES_RECENTLY_PLAYED } from '@/apollo/queries/lectures';
import { useApolloClient, useQuery } from '@apollo/client/react';

export const useGetLecturesRecentlyPlayed = ({ skip }: { skip?: boolean } = {}) => {
  const apolloClient = useApolloClient();

  const variables = {
    pagination: {
      limit: 10
    }
  }

  const { data, loading: isLoading } =
    useQuery<GetLecturesRecentlyPlayedQuery, GetLecturesRecentlyPlayedQueryVariables>(
      GET_LECTURES_RECENTLY_PLAYED,
      {
        variables,
        skip,
      });


  const items = data?.lecturesRecentlyPlayed?.items || [];

  const handleCache = (lecture: Lecture, isCompleted?: boolean) => {
    const updateFn = (data: any) => {
      const lectures = data?.lecturesRecentlyPlayed;
      let items: Lecture[] = [];

      if (isCompleted) {
        items = lectures?.items?.filter((item: Lecture) => item.id !== lecture.id);
      } else {
        items = [lecture, ...lectures?.items?.filter((item: Lecture) => item.id !== lecture.id)];
      }

      return {
        ...data,
        lecturesRecentlyPlayed: {
          ...lectures,
          items: [...items].filter(Boolean)
        }
      }
    }

    apolloClient.cache.updateQuery<GetLecturesRecentlyPlayedQuery, GetLecturesRecentlyPlayedQueryVariables>(
      {
        query: GET_LECTURES_RECENTLY_PLAYED,
        variables
      },
      (data) => updateFn(data)
    );
  }

  return {
    items,
    isLoading,
    updateRecentlyPlayedLectureCache: handleCache
  };
};
