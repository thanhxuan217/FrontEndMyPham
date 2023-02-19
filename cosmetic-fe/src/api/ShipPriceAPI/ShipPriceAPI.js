import axios from "axios"
export default class ShipPriceAPI {
    static async getShipPrice(address, cartItems) {
        const axiosPath = axios.create({
            baseURL: "https://online-gateway.ghn.vn/shiip/public-api/master-data",
            headers: {
                'Content-Type': 'application/json',
                'Token': 'fc8914d0-4b0b-11ed-8008-c673db1cbf27'
            }
        });
        const allProvince = await axiosPath.get('/province');
        const provinceInCurrentAddress = allProvince.data.data.find(province => province.ProvinceName === address.village.district.province.provinceName)
        const provinceId = provinceInCurrentAddress.ProvinceID;

        const province = {
            province_id: provinceId
        }
        const allDistrictInCurrentAddress = await axiosPath.get('/district', province);
        const districtInCurrentAddress = allDistrictInCurrentAddress.data.data.find(element => element.DistrictName === address.village.district.districtName);

        const districtId = districtInCurrentAddress.DistrictID;
        const allVillageInCurrentAddress = await axiosPath.get('/ward?district_id=' + districtId);
        const villageInCurrentAddress = allVillageInCurrentAddress.data.data.find(element => element.WardName === address.village.villageName);
        const villageId = villageInCurrentAddress.WardCode;
        //province_id=220 => can tho
        // district id = 1572 => ninhkieu
        // 550113=> xuan khanh
        const servicesAvailables = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', {
            "shop_id": 2410823,
            "from_district": 1572,
            "to_district": districtId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': 'fc8914d0-4b0b-11ed-8008-c673db1cbf27'
            }
        });

        let sumQuantity = 0;
        cartItems.listCartItem.map(cartItem => {
            sumQuantity += Number(cartItem.quantity);
        })
        // 1 kien hang tin la 2 doi
        const boxNumber = sumQuantity / 2;
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
                        "shop_id": 2410823,
                        "to_district_id": districtId,
                        "to_ward_code": villageId,
                        "service_type_id": servicesAvailable.service_type_id,
                        "height": 23 * Math.round(boxNumber),
                        "width": 10,
                        "length": 23,
                        "weight": 400 * Math.round(boxNumber)
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': 'fc8914d0-4b0b-11ed-8008-c673db1cbf27',
                            'ShopId': 2410823
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
                            'Token': 'fc8914d0-4b0b-11ed-8008-c673db1cbf27',
                            'ShopId': 2410823
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