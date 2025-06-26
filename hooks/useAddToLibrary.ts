import { useApolloClient, useMutation } from "@apollo/client";

import { AddToLibraryMutation, AddToLibraryMutationVariables, GetLecturesQuery, GetLecturesQueryVariables, Lecture, RemoveFromLibraryMutation, RemoveFromLibraryMutationVariables, SortOrder } from "@/apollo/__generated__/graphql";
import { ADD_TO_LIBRARY, GET_LECTURES, REMOVE_FROM_LIBRARY } from "@/apollo/queries/lectures";
import { useCallback } from "react";

export const useAddToLibrary = ({ lecture }: { lecture?: Lecture } = {}) => {
  const apolloClient = useApolloClient();

  const [addToLibrary, { loading: addToLibraryLoading }] = useMutation<AddToLibraryMutation, AddToLibraryMutationVariables>(ADD_TO_LIBRARY, {
    onCompleted: (data) => {
      if (lecture) {
        handleCache(lecture, true);
      }
    }
  });
  const [removeFromLibrary, { loading: removeFromLibraryLoading }] = useMutation<RemoveFromLibraryMutation, RemoveFromLibraryMutationVariables>(REMOVE_FROM_LIBRARY, {
    onCompleted: (data) => {
      if (lecture) {
        handleCache(lecture, false);
      }
    }
  });

  const handleToggleLibrary = useCallback(() => {
    if (!lecture) {
      return;
    }

    if (lecture?.metadata?.addedToLibrary) {
      removeFromLibrary({ variables: { id: lecture.id } });
    } else {
      addToLibrary({ variables: { id: lecture.id } });
    }
  }, [lecture?.metadata?.addedToLibrary]);


  const handleCache = (newLecture: Lecture, isAddedToLibrary: boolean) => {
    const buildQueryParams = (params?: any) => {
      return {
        input: {
          addedToLibrary: true
        },
        pagination: {
          sort: [{
            by: 'createdAt',
            order: SortOrder.Desc
          }]
        }
      }
    }

    const updateFn = (data: any) => {
      let items = [];
      if (isAddedToLibrary) {
        const doesLectureExist = data?.lectures?.items?.some((lecture: Lecture) => lecture.id === newLecture.id || lecture.id === undefined);
        items = doesLectureExist ?
          data?.lectures?.items?.map((lecture: Lecture) => lecture.id === newLecture.id || lecture.id === undefined ? newLecture : lecture) :
          [newLecture, ...data?.lectures?.items];
      } else {
        items = data?.lectures?.items?.filter((lecture: Lecture) => lecture.id !== newLecture.id);
      }

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
    handleToggleLibrary,
    loading: addToLibraryLoading || removeFromLibraryLoading,
    updateLectureCache: handleCache
  };
}