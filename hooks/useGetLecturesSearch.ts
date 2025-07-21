import { GetLecturesSearchQuery, GetLecturesSearchQueryVariables } from '@/apollo/__generated__/graphql';
import { GET_LECTURES_SEARCH } from '@/apollo/queries/lectures';
import { useLazyQuery } from "@apollo/client";
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useGetLecturesSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [getLecturesSearch, { data: { lecturesSearch: { items = [] } = {} } = {} }] =
    useLazyQuery<GetLecturesSearchQuery, GetLecturesSearchQueryVariables>(GET_LECTURES_SEARCH);

  const debouncedSearch = useDebouncedCallback(async (query) => {
    if (query?.length && query?.length > 2) {      
      await getLecturesSearch({ variables: { input: { query } } })
      setIsLoading(false);
    }
  }, 1000);

  const search = (query: string) => {
    if (query?.length && query?.length > 2) {
      setIsLoading(true);
      debouncedSearch(query)
    }
  }


  return {
    items,
    isLoading,
    search,
  };
};
