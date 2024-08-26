
export interface Product {
    id: number;
    productName: string;
    sellerInfo: string;
    stockCount: number;
    price: number;
    discountedPrice?: number;
    category: string;
    productImageUrls: string[];
  }
  