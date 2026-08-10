export type NavLink = {
  label: string;
  href: string;
};

export type SiteNavigation = {
  header: NavLink[];
  footerHome: NavLink[];
  footerMenu: NavLink[];
};
