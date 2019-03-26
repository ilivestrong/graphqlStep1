const assert = require('assert')

const chai = require('chai')
const expect = chai.expect

describe("smoke test", function() {

    //Spec using Node.js Assertion library
    it("checks equality", () => {
        assert.equal(10, 10)
    })
    it('checks inequality', function() {
        assert.notEqual(10, 11)
        
    })

    //Spec using Chai
    it('check equality using Chai', function() {
        expect(10).to.be.eq(10)
    })
    it('checks inequality using Chai', function() {
        expect(100).to.be.not.eq(101)
    })
})