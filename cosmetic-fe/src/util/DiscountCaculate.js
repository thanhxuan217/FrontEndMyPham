export default class DiscountCaculate {
    static getPriceAfterDiscount(price, discount, discountByCategories) {

    }
    static getDiscountDes(discount) {
        // "discountCalculated": {
        //     "discount": {
        //         "DISCOUNT_ID": 2,
        //         "DISCOUNT_NAME": "Sale chăm sóc môi",
        //         "DISCOUNT_CATEGORY": 2,
        //         "DISCOUNT_VALUE": "20000",
        //         "DISCOUNT_CONDITION": 0,
        //         "MIN_CONDITION": "0",
        //         "FROM_DATE": "2023-01-21T00:00:00.000Z",
        //         "TO_DATE": "2023-06-29T00:00:00.000Z",
        //         "STATUS": 1
        //     },
        //     "price": "200000",
        //     "priceAfterDiscount": 180000
        // }
        if (parseInt(discount.DISCOUNT_CONDITION) === 0) {
            // Tổng giá trị các sản phẩm khuyến mãi tối thiểu => discount_condition = 1
            //Tổng số lượng sản phẩm được khuyến mãi tối thiếu => discount_condition = 2
            return {
                isDiscount: true,
                
            }
        }
        else {
            return { isDiscount: false }
        }
    }
}
