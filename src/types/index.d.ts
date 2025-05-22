export type NavItem = {
  label: string;
  href: string;
  target: boolean;
};

export type BreadcrumbLink = {
  label: string;
  href: string;
};

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'link'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | null
  | undefined;

export type ReferenceLink = {
  _type: 'reference';
  _id: string;
  title: string;
  slug: {
    current: string;
  };
};

export type CustomLink = {
  _type?: 'customLink';
  title: string;
  href: string;
  target?: boolean;
  buttonVariant: ButtonVariant;
};

export type LinkType = ReferenceLink | CustomLink;
