class RegularExpression {
    static checkEmail(email) {
        let regex = new RegExp('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}');
        return regex.test(email);
    }
    static checkPassword(password) {
        let regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$');
        //   (?=.*\d)          // should contain at least one digit
        //   (?=.*[a-z])       // should contain at least one lower case
        //   (?=.*[A-Z])       // should contain at least one upper case
        //   [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
        return regex.test(password);
    }
    
    static checkPhone(phone) {
        let regex = new RegExp('(84|0[3|5|7|8|9])+([0-9]{8})\\b');
        return regex.test(phone);
    }
    static checkUserName(userName) {
        let regex = new RegExp('^(?!.*[@!#$&*]).{8,}$');
        return regex.test(userName)
    }
    static checkProductName(productName) {
        let regex = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');
        return regex.test(productName);
    }
}
export default RegularExpression;