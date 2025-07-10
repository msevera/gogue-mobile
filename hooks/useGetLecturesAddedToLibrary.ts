import { GetLecturesAddedToLibraryQuery, GetLecturesAddedToLibraryQueryVariables, Lecture } from '@/apollo/__generated__/graphql';
import { GET_LECTURES_ADDED_TO_LIBRARY } from '@/apollo/queries/lectures';
import { useApolloClient, useQuery } from "@apollo/client";

export const useGetLecturesAddedToLibrary = ({ skip }: { skip?: boolean } = {}) => {
  const apolloClient = useApolloClient();

  const variables = {
    pagination: {
      limit: 15
    }
  }

  const { data: { lecturesAddedToLibrary: { items = [], pageInfo } = { items: [], pageInfo: { next: null } } } = {}, loading: isLoading, fetchMore } =
    useQuery<GetLecturesAddedToLibraryQuery, GetLecturesAddedToLibraryQueryVariables>(GET_LECTURES_ADDED_TO_LIBRARY, {
      variables,
      skip,
      onError: (error) => {
        console.log('error', error)
      }
    });


  const handleCache = (newLecture: Lecture, isAddedToLibrary: boolean) => {
    const updateFn = (data: any) => {
      let items = [];
      const lectures = data?.lecturesAddedToLibrary;
      if (isAddedToLibrary) {
        const doesLectureExist = lectures?.items?.some((lecture: Lecture) => lecture.id === newLecture.id || lecture.id === undefined);
        items = doesLectureExist ?
          lectures?.items?.map((lecture: Lecture) => lecture.id === newLecture.id || lecture.id === undefined ? newLecture : lecture) :
          [newLecture, ...(lectures?.items || [])];
      } else {
        items = lectures?.items?.filter((lecture: Lecture) => lecture.id !== newLecture.id);
      }

      return {
        ...data,
        lecturesAddedToLibrary: {
          ...lectures,
          items: [...items].filter(Boolean),
          pageInfo: data?.lecturesAddedToLibrary?.pageInfo || {
            next: null
          }
        }
      }
    }

    apolloClient.cache.updateQuery<GetLecturesAddedToLibraryQuery, GetLecturesAddedToLibraryQueryVariables>(
      {
        query: GET_LECTURES_ADDED_TO_LIBRARY,
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
    updateLectureCache: handleCache,
    fetchMore: fetchMoreLectures
  };
};
