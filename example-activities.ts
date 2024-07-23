import type { Activity } from "./src/types";

export const WelcomeActivity: Activity = {
  id: "123abc",
  type: "activity",
  name: "Welcome",
  description: "Welcome to the course!",
  status: "not started",
  sequence: "sequential",
  canRevise: false,
  children: [
    {
      type: "text-slide",
      name: "Intro",
      title: "Hvordan skyte en fotball. Med riktig teknikk",
      content:
        "Denne videoen viser deg hvordan du skyter en fotball. Med riktig teknikk. Let's go!",
      status: "not started",
      id: "1",
    },
    {
      type: "yt-video",
      name: "The video",
      startAt: 0,
      endAt: 11,
      status: "not started",
      ytId: "s21Hf39-h64",
      id: "2",
    },
    {
      type: "text-slide",
      name: "Alltid likt",
      title: "Alltid likt",
      content: "Ting som alltid er likt når du skal skyte en fotball:",
      status: "not started",
      id: "3",
    },
    {
      type: "text-slide",
      name: "Plant den andre foten ved siden av ballen",
      title: "Plant den andre foten ved siden av ballen",
      content:
        "Du planter den andre foten ved siden av ballen, slik at den peker i den retingen du vil skyte ballen. Litt bøyd i kneet.",
      status: "not started",
      id: "4",
    },
    {
      type: "yt-video",
      name: "The planting foot",
      status: "not started",
      ytId: "s21Hf39-h64",
      id: "5",
      startAt: 35,
      endAt: 55,
    },
    {
      type: "text-slide",
      name: "Lås ankelen",
      title: "Lås ankelen",
      content:
        "Lås ankelen når du skyter. Da har du mer kontroll og får et renere og kraftigere skudd.",
      status: "not started",
      id: "6",
    },
    {
      type: "yt-video",
      name: "Lock the ankle",
      status: "not started",
      startAt: 55,
      endAt: 74,
      ytId: "s21Hf39-h64",
      id: "7",
    },
    {
      type: "multiple-choice-question",
      name: "Quiz 1",
      question:
        "Hva er de 2 tingene som alltid er likt når du skyter en fotball?",
      options: [
        { id: "1", option: "Plant den andre foten ved siden av ballen" },
        { id: "2", option: "Lås ankelen" },
        { id: "3", option: "Løp" },
        { id: "4", option: "Hopp" },
      ],
      answer: ["1", "2"],
      status: "not started",
      alloweNumberOfAttempts: 1,
      id: "8",
    },
  ],
};
