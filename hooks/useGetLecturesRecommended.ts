import { GetLecturesRecommendedQuery, GetLecturesRecommendedQueryVariables } from '@/apollo/__generated__/graphql';
import { GET_LECTURES_RECOMMENDED } from '@/apollo/queries/lectures';
import { useQuery } from '@apollo/client';

export const useGetLecturesRecommended = () => {
  const { data: { lecturesRecommended: { items = [] } = { items: [] } } = {}, loading: isLoading, refetch } =
    useQuery<GetLecturesRecommendedQuery, GetLecturesRecommendedQueryVariables>(GET_LECTURES_RECOMMENDED);

  return {
    items,
    isLoading,
    refetch
  };
};
