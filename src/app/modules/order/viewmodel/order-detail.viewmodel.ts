import {OrderDetail} from '../model/order.model';

export class OrderDetailViewModel {
    id: string;
    code: string;
    name: string;
    customerName: string;
    phoneNumber: string;
    address: string;
    email: string;
    note: string;
    totalPrice: number;
    discount: number;
    discountType: number;
    quantity: number;
    status: number;
    type: number;
    deliveryDate: Date;
    createTime: Date;
    creatorFullName: string;
    concurrencyStamp: string;
    orderDetails: OrderDetail[];
}