export type Status = "not started" | "in progress" | "done";

export type Sequence = "sequential" | "whatever";

export type CommonActivityProperties = {
  name: string;
  description?: string;
  status: Status;
  id: string;
};

export type Activity = {
  type: "activity";
  name: string;
  description?: string;
  status: Status;
  sequence: Sequence;
  canRevise: boolean;
  children: Array<
    | Activity
    | YtVideo
    | TextSlide
    | TextQuestion
    | MultipleChoiceQuestion
    | RadioQuestion
  >;
  id: string;
};

export type YtVideo = {
  type: "yt-video";
  name: string;
  description?: string;
  startAt: number;
  endAt?: number;
  progress?: number;
  status: Status;
  ytId: string;
  id: string;
};

export type TextSlide = {
  type: "text-slide";
  name: string;
  description?: string;
  title: string;
  content: string;
  status: Status;
  id: string;
};

export type TextQuestion = {
  type: "text-question";
  name: string;
  description?: string;
  question: string;
  answer?: string;
  attempt?: string;
  status: Status;
  id: string;
};

export type MultipleChoiceQuestion = {
  type: "multiple-choice-question";
  name: string;
  description?: string;
  question: string;
  options: Array<{ id: string; option: string; image?: string }>;
  answer: Array<string>;
  alloweNumberOfAttempts: number;
  attempt?: Array<string>;
  status: Status;
  id: string;
};

export type RadioQuestion = {
  type: "radio-question";
  name: string;
  description?: string;
  question: string;
  options: Array<{ id: string; option: string; image?: string }>;
  answer: string;
  alloweNumberOfAttempts: number;
  attempt?: string;
  status: Status;
  id: string;
};
