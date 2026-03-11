export type SlideType = {
  id?: string;
  name: string;
  a1_banner?: string | null | undefined; // a1_banner는 선택적이며, string 또는 null 또는 undefined일 수 있습니다.
};

export type BannerType = {
  bannerId: string;
  title: string;
};
