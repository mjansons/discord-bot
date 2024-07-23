import supertest from 'supertest'
import app from '@/app'
import { describe, it, expect } from 'vitest'


describe("GET /messages", () =>  {

    it("get a list of all congratulatory messages",() => {
        const response = supertest(app)
    })

})

describe("GET", () =>  {
    // GET /messages?username=johdoe - get a list of all congratulatory messages for a specific user
    // getUserMessages()
})

describe("GET", () =>  {
    // GET /messages?sprint=WD-1.1 - get a list of all congratulatory messages for a specific sprint
    // getAllSprintMessages()
})

describe("POST", () =>  {
    // send a congratulatory message
    // sendCongratulations()
})