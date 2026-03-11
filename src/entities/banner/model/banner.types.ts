export interface BannerItemType {
  id?: string | number;
  badge: {
    imgurl: string;
    clickUrl: string;
    openInExternalBrowser: string;
    imageWidth?: string;
    imageHeight?: string;
    backgroundcolor?: string;

    type: string;
    mainTitle?: {
      title1?: React.ReactNode;
      title2?: React.ReactNode;
      title3?: React.ReactNode;
    };
    subText?: {
      text1?: React.ReactNode;
      text2?: React.ReactNode;
      text3?: React.ReactNode;
    };
    buttonText?: string;

    imgWidth?: string;
    imgHeight?: string;

    imgBottomUrl?: string;
    imgBottomWidth?: string;
    imgBottomHeight?: string;

    imgPcUrl?: string;
    imgTabletUrl?: string;
    imgMobileUrl?: string;

    images?: {
      main: string;
      flag: string;
      mascot: string;
    };

    imgOffUrl?: string;
    imgOnUrl?: string;

    imgPcOffUrl?: string;
    imgPcOnUrl?: string;
    imgMobileOffUrl?: string;
    imgMobileOnUrl?: string;

    imgOffWidth?: string;
    imgOffHeight?: string;
    imgOnWidth?: string;
    imgOnHeight?: string;

    imgMTopOffUrl?: string;
    imgMTopOnUrl?: string;
    imgMBottomUrl?: string;

    imgMTopWidth?: string;
    imgMTopHeight?: string;
    imgMBottomWidth?: string;
    imgMBottomHeight?: string;
  };
  a1_banner?: string;
}