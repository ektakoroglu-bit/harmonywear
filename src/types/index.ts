export type Locale = 'tr' | 'en';

export interface Product {
  id: string;
  slug: string;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  price: number;
  salePrice?: number;
  images: string[];
  category: ProductCategory;
  sizes: ProductSize[];
  colors: ProductColor[];
  stock: StockItem[];
  material: { tr: string; en: string };
  care: { tr: string; en: string };
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  tags: string[];
  sku: string;
  createdAt: string;
}

export type ProductCategory = 'bodysuits' | 'shapewear' | 'bras' | 'briefs' | 'sets';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '2XL' | '3XL';

export interface ProductColor {
  name: string;
  hex: string;
  label: { tr: string; en: string };
}

export interface StockItem {
  size: ProductSize;
  color: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  size: ProductSize;
  color: ProductColor;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  discountMinOrder: number | null;
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number;
  addItem: (product: Product, size: ProductSize, color: ProductColor, quantity?: number) => void;
  removeItem: (productId: string, size: ProductSize, color: string) => void;
  updateQuantity: (productId: string, size: ProductSize, color: string, quantity: number) => void;
  applyDiscount: (code: string, discounts: DiscountCode[]) => boolean;
  removeDiscount: () => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: { tr: string; en: string };
  subtitle: { tr: string; en: string };
  image: string;
  imageMobile?: string;
  link?: string;
  order: number;
  isActive: boolean;
  buttonText?: { tr: string; en: string };
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  discountCode?: string;
  status: OrderStatus;
  paymentId?: string;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district?: string;
  zipCode?: string;
  country: string;
  isDefault?: boolean;
}

export interface PointsTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: 'account_creation' | 'purchase' | 'redeemed' | 'other';
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  addresses: SavedAddress[];
  points: number;
  pointsHistory: PointsTransaction[];
  createdAt: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  register: (data: RegisterData) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  addPoints: (amount: number, reason: PointsTransaction['reason'], description: string, orderId?: string) => void;
  redeemReward: (requiredPoints: number, discountValue: number) => { success: boolean; code?: string };
}

export interface CheckoutFormData {
  customer: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  sameAddress: boolean;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export interface FilterState {
  category: ProductCategory | 'all';
  sizes: ProductSize[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'newest' | 'priceAsc' | 'priceDesc' | 'popular';
  searchQuery: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  orderId: string;
  rating: number; // 1–5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface StockNotification {
  id: string;
  productId: string;
  productName: string;
  size: string;
  colorName: string;
  colorHex: string;
  email: string;
  createdAt: string;
}

export interface AdminState {
  products: Product[];
  discounts: DiscountCode[];
  banners: Banner[];
  orders: Order[];
  reviews: Review[];
  stockNotifications: StockNotification[];
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, stockItems: StockItem[]) => void;
  addOrder: (order: Order) => void;
  addDiscountCode: (discount: Omit<DiscountCode, 'id' | 'usedCount'>) => void;
  updateDiscountCode: (id: string, updates: Partial<DiscountCode>) => void;
  deleteDiscountCode: (id: string) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (orderedIds: string[]) => void;
  addReview: (review: Omit<Review, 'id' | 'status' | 'createdAt'>) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  addStockNotification: (n: Omit<StockNotification, 'id' | 'createdAt'>) => void;
  deleteStockNotification: (id: string) => void;
}
