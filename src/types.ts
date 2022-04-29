export type Category = {
  name: string,
};

export type Currency = {
  label: string,
  symbol: string,
};

export type Price = {
  currency: Currency,
  amount: number,
};

export type Attribute = {
  displayValue?: string,
  value: string,
  id: string,
};

export type AttributeSet = {
  id: string,
  name: string,
  type?: string,
  items: Attribute[],
};

export type ProductType = {
  id: string,
  brand: string,
  name: string,
  inStock: boolean,
  category: string,
  description: string,
  gallery: string[],
  prices: Price[],
  attributes: AttributeSet[],
};

export type ProductInfo = {
  id: string,
  brand: string,
  name: string,
  inStock?: boolean,
  attributes: string[],
  prices: Price[],
  gallery: string[],
  imageIndex: number,
  currency: string,
  itemCount: number,
};

export type CurrencyQuery = {
  currencies: Currency[],
};

export type CategoryNamesQuery = {
  categories: Category[],
};

export type GoodsQuery = {
  category: {
    name: string,
    products: ProductType[],
  }
};

export type ProductQuery = {
  product: ProductType,
};
