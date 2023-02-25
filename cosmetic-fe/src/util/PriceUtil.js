import axios from "axios";
export default class PriceUltil {
    static priceSale(price, discount) {
        return parseFloat(price) - parseFloat(price) * parseFloat(discount);
    }
    static convertToUSD(price) {
        let priceInUSD;
        // const accountId = 'ctu945399548';
        // const password = 'k4r11must7hpplafd1u4105onj';
        // await axios.get('https://xecdapi.xe.com/v1/convert_from.json',
        //     {
        //         auth: {
        //             username: accountId,
        //             password: password
        //         },
        //         params: {
        //             from: 'VND',
        //             to: 'USD',
        //             amount: price
        //         }
        //     }
        // ).then(res => {
        //     priceInUSD = res.data.to[0].mid;
        // })
        // return Math.round(priceInUSD);
        return Math.round(price/24842.50);
    }
}