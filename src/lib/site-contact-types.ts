export type SiteContactAddress = {
  line1: string;
  line2: string;
};

export type SiteContactInfo = {
  companyName: string;
  address: SiteContactAddress | null;
  phones: string[];
  emails: string[];
  lineId: string;
  lineUrl: string;
  facebookUrl: string;
  facebookPageName: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  tiktokHandle: string;
  mapEmbedUrl: string | null;
  businessHours: string;
};
