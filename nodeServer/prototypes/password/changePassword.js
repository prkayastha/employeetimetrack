/**
 * Class to create model for changing password
 */
class ChangePassword {
    /**
     * instanciate class ChangePassword
     * @param {Object} source source object to create instance of ChangePassword
     */
    constructor(source) {
        this.id = 0;
        this.oldPassword = null;
        this.password = null;
        this.confirmPassword = null;

        for (let attr of Object.keys(this)) {
            if (source.hasOwnProperty(attr)) {
                this[attr] = source[attr];
            }
        }

        if ((this.id == 0 || this.id == undefined) && source.hasOwnProperty('userId')) {
            this.id = source.userId;
        }
    }
}

module.exports = ChangePassword;
