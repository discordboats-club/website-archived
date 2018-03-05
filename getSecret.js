const fs = require("fs");
const randomstring = require("randomstring");
/**
 * This function will stop all execution until it's done!!!!!!
 * @returns {String}
 */
module.exports = () => {
    if (fs.existsSync("secret")) return fs.readFileSync("secret").toString();
    else {
        const secret = randomstring.generate(500);
        fs.writeFileSync("secret", secret);
        return secret;
    }
}