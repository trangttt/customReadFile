var fs = require("fs");
var path = require("path")
var createKeccakHash = require('keccak')


/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

/**
 * Checks if the given string is a checksummed address
 * WARN: address like 0x111111111111111111111111111111111111111111 still pass this test.!!!!!
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
function isChecksumAddress (address) {
    var origin = address
    address = address.toLowerCase().replace('0x', '')
    var hash = createKeccakHash('keccak256').update(address).digest('hex')
    var ret = '0x'

    for (var i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toUpperCase()
        } else {
            ret += address[i]
        }
    }
    return ret ===  origin
}

/**
 * Iterate over a folder and call readFile for each file
 *
 * @method readFolder
 * @param {String} full path to the folder
 */
function readFolder(folderPath){
   var contents
   try {
        contents = fs.readdirSync(folderPath, 'utf8');
        for (var i = 0; i < contents.length; i++){
            console.log("File ", contents[i])
           readFile(path.join(folderPath, contents[i]))
        }
   } catch (err){
        // in case of error, early exit
        console.log("Cannot open folder", err)
        return
   }
}


/**
 * Read a file and print out array of Ethereum addresses.
 * It skips incorrect Ethereum addresses and token number less than 0
 *
 * @method readFile
 * @param {String} path to the file
 */
function readFile(filePath) {
    var contents
    try {
        contents = fs.readFileSync(filePath, 'utf8');
    } catch (err){
        // in case of error, early exit
        console.log("Cannot open file", err)
        return
    }

    var lines = contents.split("\n");
    var addresses = new Array()

    for ( var i=0; i < lines.length; i++){
        // skip the last empty line
        if ("" !== lines[i].trim()) {
            var raw = lines[i].replace(' ', '')
            var parts = raw.split(",")

            var address = parts[0].trim()
            var tokenNumber = parseInt(parts[1])

            // only keep non-negative token and valid address
            if (tokenNumber > 0 && isAddress(address)) {
                addresses.push({"address": address,
                                "token": tokenNumber})
            }
        }
    }

    console.log(addresses)
    return addresses

}






if (require.main === module) {
    // readFile('test.txt')
    // readFolder('data')
    var right = "0xFe12fB137a35aE46a021272440F5505E1fd4e7d9"
    console.log(/^(0x)?[0-9a-f]{40}$/i.test(right))
    // var wrong = "0xFe12fb137a35ae46a021272440f5505e1fd4e7D9"
    // console.log(isChecksumAddress(right))
    // console.log(isChecksumAddress(wrong))
}

module.exports = {
    "readFile": readFile,
    "readFolder": readFolder,
}
