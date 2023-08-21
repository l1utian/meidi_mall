export interface Datum {
  addTime?: string;
  /**
   * 商品描述
   */
  brief?: string;
  /**
   * 原价
   */
  counterPrice?: number;
  deleted?: number;
  detail?: string;
  gallery?: string;
  goodsProductList?: null;
  goodsSn?: string;
  /**
   * 商品ID
   */
  id?: number;
  isAsc?: null;
  isHot?: number;
  isNew?: number;
  isOnSale?: number;
  keywords?: string;
  /**
   * 商品名称
   */
  name?: string;
  orderBy?: null;
  orderByColumn?: null;
  params?: null;
  /**
   * 商品图片
   */
  picUrl?: string;
  /**
   * 现价
   */
  retailPrice?: number;
  searchValue?: null;
  shareUrl?: null;
  sortOrder?: number;
  unit?: string;
  updateTime?: string;
}
