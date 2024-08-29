
export interface Product {
    id: number;
    productName: string;
    sellerInfo: string;
    stockCount: number | null;
    price: number | null;
    discountedPrice?: number | null;
    category: string;
    productImageUrls: string[];
  }
  