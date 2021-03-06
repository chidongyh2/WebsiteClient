export class SearchCustomerForSupportViewModel {
    id: number;
    billId: number;
    billNo: string;
    patientId: string;
    patientFullName: string;
    patientPhone: string;
    patientAge: string;
    patientBirthday?: Date;
    patientGender?: boolean;
    examinationDate?: Date;
    appointmentDate?: Date;
    userFullName: string;
    patientAddress: string;
    doctorFullName: string;
    doctorId: string;
    roomId: string;
    roomName: string;
    departmentId: string;
    departmentName: string;
    isAbnormal: boolean;
    objectName: string;
    isSupport: boolean;
    dateSupportNewest: Date;
    diagnose: string;
    total: number;
    joinedServiceNames: string;
    statusCall: number;
    totalDate: number;
}
