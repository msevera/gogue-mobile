import { GetLecturesRecommendedQuery, GetLecturesRecommendedQueryVariables, GetMatchedSourcesQuery, GetMatchedSourcesQueryVariables, Source } from '@/apollo/__generated__/graphql';
import { GET_LECTURES_RECOMMENDED } from '@/apollo/queries/lectures';
import { GET_MATCHED_SOURCES } from '@/apollo/queries/sources';
import { useQuery } from '@apollo/client';

type MatchedSourcesType = {
  items: Source[];
  isLoading: boolean;
  refetch: () => void;
}

export const useGetSourcesMatched = (input: string): MatchedSourcesType => {
  const {
    data: { sourcesMatched: { items = [] } = { items: [] } } = {}, loading: isLoading, refetch } =
    useQuery<GetMatchedSourcesQuery, GetMatchedSourcesQueryVariables>(GET_MATCHED_SOURCES, {
      variables: {
        input: {
          input
        }
      },
      onError: (error) => {
        console.log('error', error);
      }
    });

  return {
    items: items as Source[],
    isLoading,
    refetch
  };
};
