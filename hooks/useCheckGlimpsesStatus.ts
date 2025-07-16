import { CheckGlimpsesStatusQuery, CheckGlimpsesStatusQueryVariables } from '@/apollo/__generated__/graphql';
import { CHECK_GLIMPSES_STATUS } from '@/apollo/queries/glimpses';
import { useQuery } from '@apollo/client';

export const useCheckGlimpsesStatus = () => {
  const {
    data: { checkGlimpsesStatus } = {}, loading: isLoading, refetch } =
    useQuery<CheckGlimpsesStatusQuery, CheckGlimpsesStatusQueryVariables>(CHECK_GLIMPSES_STATUS);

  return {
    glimpsesStatus: checkGlimpsesStatus,
    isLoading,
    refetch
  };
};
