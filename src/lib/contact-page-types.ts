export type ContactPageTopic = {
  title: string;
  description: string;
};

export type ContactPageLineQr = {
  src: string;
  alt: string;
  caption: string;
};

export type ContactPageContent = {
  title: string;
  subtitle: string;
  intro: string;
  about: string;
  hoursNote: string;
  topicsTitle: string;
  topics: ContactPageTopic[];
  channelsTitle: string;
  channelsIntro: string;
  lineQr: ContactPageLineQr;
  tipsTitle: string;
  tips: string[];
};
