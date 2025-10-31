import { GetGlimpseLatestQuery, GetGlimpseLatestQueryVariables } from '@/apollo/__generated__/graphql';
import { GET_GLIMPSES_LATEST } from '@/apollo/queries/glimpses';
import { useQuery } from '@apollo/client/react';

export const useGetGlimpsesLatest = () => {
  const {
    data: { glimpsesLatest: { items = [] } = { items: [] } } = {},
    loading: isLoading,
    refetch } =
    useQuery<GetGlimpseLatestQuery, GetGlimpseLatestQueryVariables>(GET_GLIMPSES_LATEST);

  return {
    items,
    isLoading,
    refetch
  };
};
