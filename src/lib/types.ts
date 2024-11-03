export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  age: number;
  isActive: boolean;
  isDeleted: boolean;
  role: Role | string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: CreatedBy;
  permissions: Permission[];
}

export interface Role {
  _id: string;
  name: string;
}

export const ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export interface Permission {
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

export interface IResponse<T> {
  message: string;
  data: T;
}
export interface IPagedRequest {
  current: number;
  pageSize: number;
}
export interface IPagedResponse<T> {
  statusCode: number;
  message: string;
  data: {
    meta: {
      current: number;
      pageSize: number;
      total: number;
      pages: number;
    };
    result: T[];
  };
}
export interface SchoolarShip {
  _id: string;
  name: string;
  image: string[];
  location: string;
  continent: string;
  level: string[];
  major: string[];
  quantity: number;
  description: string;
  isActive: boolean;
  createdBy: CreatedBy;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatedBy {
  _id: string;
  email: string;
}

export enum ResumeStatus {
  PENDING = 'PENDING', // Waiting for payment
  PAID = 'PAID', // Payment received, waiting for approval
  REJECTED = 'REJECTED', // Rejected
  REVIEWING = 'REVIEWING', // In reviewing
  DONE = 'DONE', // Approved
}

export interface Resume {
  _id: string;
  email: string;
  userId: string;
  urlCV: string;
  status: ResumeStatus;
  provider: string;
  scholarship: Pick<SchoolarShip, '_id' | 'name'>;
  history: History[];
  orderCode: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt?: string;
  __v: number;
  createdBy: CreatedBy;
  updatedBy: CreatedBy;
}

export interface History {
  status: string;
  updatedAt: string;
  updatedBy: CreatedBy;
}

export interface PaymentLink {
  bin: string; // Mã BIN ngân hàng
  accountNumber: string; // Số tài khoản của kênh thanh toán
  accountName: string; // Tên chủ tài khoản của kênh thanh toán
  amount: number; // Số tiền của đơn hàng
  description: string; // Mô tả đơn hàng, được sử dụng làm nội dung chuyển khoản
  orderCode: number; // Mã đơn hàng
  currency: string; // Đơn vị tiền tệ
  paymentLinkId: string; // ID link thanh toán
  status: string; // Trạng thái của link thanh toán
  checkoutUrl: string; // Đường dẫn trang thanh toán
  qrCode: string; // Mã QR thanh toán
}
