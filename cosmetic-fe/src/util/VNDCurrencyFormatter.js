export default class VNDCurrencyFormatter {
    static formatToVND(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }
}
