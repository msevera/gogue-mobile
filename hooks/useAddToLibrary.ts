import { useMutation } from "@apollo/client";

import { AddToLibraryMutation, AddToLibraryMutationVariables, Lecture, RemoveFromLibraryMutation, RemoveFromLibraryMutationVariables } from "@/apollo/__generated__/graphql";
import { ADD_TO_LIBRARY, REMOVE_FROM_LIBRARY } from "@/apollo/queries/lectures";
import { useCallback } from "react";
import { useGetLecturesAddedToLibrary } from './useGetLecturesAddedToLibrary';
import { useAnalytics } from "./useAnalytics";

export const useAddToLibrary = ({ lecture }: { lecture?: Lecture } = {}) => {
  const { updateLectureCache } = useGetLecturesAddedToLibrary({ skip: true });
  const { track } = useAnalytics();

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
      track('lecture_remove_from_library', {
        lectureId: lecture.id,
        slug: lecture?.slug,
        title: lecture?.title
      });
      await removeFromLibrary({ variables: { id: lecture.id } });
    } else {
      track('lecture_add_to_library', {
        lectureId: lecture.id,
        slug: lecture?.slug,
        title: lecture?.title
      });
      await addToLibrary({ variables: { id: lecture.id } });
    }
  }, [lecture]);


  return {
    handleToggleLibrary,
    loading: addToLibraryLoading || removeFromLibraryLoading
  };
}