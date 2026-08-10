export type OrderGuideStep = {
  title: string;
  description: string;
};

export type OrderGuideSection = {
  title: string;
  bodyHtml: string;
};

export type OrderGuideContent = {
  title: string;
  subtitle: string;
  stepsHeading: string;
  steps: OrderGuideStep[];
  sections: OrderGuideSection[];
};
