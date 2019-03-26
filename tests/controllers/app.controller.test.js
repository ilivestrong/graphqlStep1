const chai = require('chai')
const { expect } = chai

const sinon = require('sinon')

const indexPage = require('../../controllers/app.controller')

const User = {
    addUser: (name) => {
        this.name = name
    },
    isLoggedIn : function () { }
}

describe("getIndexPage", function () {
    it('should return index page', function () {
        let req = {
            user: User
        }
        // Add Stub for User.IsLoggedIn()
        const isLoggedInStub = sinon.stub(User, "isLoggedIn").returns(false)

        let res = {
            send: sinon.spy()
        }

        indexPage.getIndexPage(req, res)

        // Adding Spy on existing functions
        sinon.spy(User, 'addUser')
        User.addUser('Deepak Pathak')
        // User.addUser(null)
        
        
        expect(User.addUser.calledOnce).to.be.true
        expect(res.send.calledOnce).to.be.true
        expect(res.send.firstCall.args[0]).to.be.equal('NOT LOGGED IN')


        

    })
})