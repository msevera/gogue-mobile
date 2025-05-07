export type GeneratingLecturePlanMessage = {
  topic: string;
  title: string;
}

export type GeneratingLectureContentMessage = {
  title: string;
}

export type GeneratingLectureCreatedMessage = {
  lectureId: string;
}