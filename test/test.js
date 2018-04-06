var assert = require('assert');
var customReadFile = require('../customReadFile.js');


function customTest(filePath, expected) {
    var result = customReadFile.readFile(filePath)
    assert.equal(JSON.stringify(expected), JSON.stringify(result))
}


describe('testReadFile', function() {
    describe('#readFile()', function() {
        it('Correct entries', function() {
           var expected = [{"address": "0xd9f2969E7DaF6728E7f2FDf58e4509166ef5F278" , "token": 12},
                            {"address": "0xFe12fB137a35aE46a021272440F5505E1fd4e7d9", "token": 1}]
           customTest("./data/correctEntries.txt", expected)
        });
        it('Incorrect Entries. Should return empty', function() {
           customTest("./data/incorrectEntries.txt", [])
        });
        it('Empty file. Should return empty', function() {
           customTest("./data/empty.txt", [])
        })

    });
});