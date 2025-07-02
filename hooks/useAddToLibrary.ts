import { useMutation } from "@apollo/client";

import { AddToLibraryMutation, AddToLibraryMutationVariables, Lecture, RemoveFromLibraryMutation, RemoveFromLibraryMutationVariables } from "@/apollo/__generated__/graphql";
import { ADD_TO_LIBRARY, REMOVE_FROM_LIBRARY } from "@/apollo/queries/lectures";
import { useCallback } from "react";
import { useGetLecturesAddedToLibrary } from './useGetLecturesAddedToLibrary';

export const useAddToLibrary = ({ lecture }: { lecture?: Lecture } = {}) => {
  const { updateLectureCache } = useGetLecturesAddedToLibrary({ skip: true });

  const [addToLibrary, { loading: addToLibraryLoading }] = useMutation<AddToLibraryMutation, AddToLibraryMutationVariables>(ADD_TO_LIBRARY, {
    onCompleted: (data) => {
      if (lecture) {
        updateLectureCache(lecture, true);
      }
    }
  });
  const [removeFromLibrary, { loading: removeFromLibraryLoading }] = useMutation<RemoveFromLibraryMutation, RemoveFromLibraryMutationVariables>(REMOVE_FROM_LIBRARY, {
    onCompleted: (data) => {
      if (lecture) {
        updateLectureCache(lecture, false);
      }
    }
  });

  const handleToggleLibrary = useCallback(async() => {    
    if (!lecture) {
      return;
    }

    if (lecture?.metadata?.addedToLibrary) {
      await removeFromLibrary({ variables: { id: lecture.id } });
    } else {
      await addToLibrary({ variables: { id: lecture.id } });
    }
  }, [lecture]);


  return {
    handleToggleLibrary,
    loading: addToLibraryLoading || removeFromLibraryLoading
  };
}