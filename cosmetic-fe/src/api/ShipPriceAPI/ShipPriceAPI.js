import axios from "axios"
export default class ShipPriceAPI {
    static async getShipPrice(address, cartItems) {
        const axiosPath = axios.create({
            baseURL: "https://online-gateway.ghn.vn/shiip/public-api/master-data",
            headers: {
                'Content-Type': 'application/json',
                'Token': '210d4f5b-b4d4-11ed-9dc6-f64f768dbc22'
            }
        })
        const allProvince = await axiosPath.get('/province');
        const provinceInCurrentAddress = allProvince.data.data.find(province => province.ProvinceName === address.VILLAGE.DISTRICT.PROVINCE.PROVINCE_NAME)
        const provinceId = provinceInCurrentAddress.ProvinceID;

        const province = {
            province_id: provinceId
        }
        const allDistrictInCurrentAddress = await axiosPath.get('/district', province);
        const districtInCurrentAddress = allDistrictInCurrentAddress.data.data.find(element => element.DistrictName === address.VILLAGE.DISTRICT.DISTRICT_NAME);

        const districtId = districtInCurrentAddress.DistrictID;
        const allVillageInCurrentAddress = await axiosPath.get('/ward?district_id=' + districtId);
        const villageInCurrentAddress = allVillageInCurrentAddress.data.data.find(element => element.WardName === address.VILLAGE.VILLAGE_NAME);
        const villageId = villageInCurrentAddress.WardCode;
        //province_id=220 => can tho
        // district id = 1572 => ninhkieu
        // 550113=> xuan khanh
        const servicesAvailables = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', {
            "shop_id": 3837693,
            "from_district": 1572,
            "to_district": districtId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': '210d4f5b-b4d4-11ed-9dc6-f64f768dbc22'
            }
        });

        let sumQuantity = 0;
        cartItems.map(cartItem => {
            sumQuantity += Number(cartItem.quantity);
        })
        // 1 kien hang tin la 2 doi
        let boxNumber = sumQuantity / 2;
        if (boxNumber == 0) {
            boxNumber = 1;
        }
        let result;
        if (servicesAvailables.data.data.length !== 0) {
            const getData = async () => {
                let result = [];
                //await promise all
                await Promise.all(servicesAvailables.data.data.map(async (servicesAvailable) => {
                    const feeShip = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
                        "shop_id": 3837693,
                        "to_district_id": districtId,
                        "to_ward_code": villageId,
                        "service_type_id": servicesAvailable.service_type_id,
                        "height": 15 * Math.round(boxNumber),
                        "width": 4,
                        "length": 4,
                        "weight": 50 * Math.round(boxNumber)
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': '210d4f5b-b4d4-11ed-9dc6-f64f768dbc22',
                            'ShopId': 3837693
                        }
                    })
                    const time = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime', {
                        "from_district_id": 1572,
                        "from_ward_code": "550113",
                        "to_district_id": districtId,
                        "to_ward_code": villageId + '',
                        "service_id": servicesAvailable.service_id
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': '210d4f5b-b4d4-11ed-9dc6-f64f768dbc22',
                            'ShopId': 3837693
                        }
                    })
                    result.push({
                        feeShip: feeShip.data.data,
                        time: time.data.data,
                        service: servicesAvailable
                    })
                }))
                return result;
            }
            result = await getData();
        } else {
            result.push({
                feeShip: 0,
                service: 'not available',
                time: 0
            })
        }
        return result;
    }
}