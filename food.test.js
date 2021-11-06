const client = require('./client')('localhost', 8000)

/**
 * Food is represented by a json with a following format
 * {'name':'name of the food', 'calories': 10 }
 * When a food is created it will get a randomly generated id 
 * and a food becomes
 * {'name':'name of the food', 'calories': 10, 'id': 'abcd1234' }
 */

describe('Food tests', () => {
    it('test runner works', () => {
        expect(1).toBe(1)
    })
    it('returns error for missing food name', async () => {

        const postResponse = await client.post('/api/food', {'calories':20})

        expect(postResponse.code).toBe(400)
    })
    it('returns error fornegative calories', async () => {

        const postResponse = await client.post('/api/food', {'name':'krumpli','calories':-20})

        expect(postResponse.code).toBe(400)
    })
    it('can return created food', async () => {
        let sajt = {'name': 'sajt', 'calories':50}
        let alma = {'name': 'alma', 'calories': 10}
        
        const sajtpostResponse = await client.post('/api/food', sajt)
        const almapostResponse = await client.post('/api/food', alma)

        const sajtResponse = await client.post('/api/food', sajt)
        const sajtId = JSON.parse(sajtResponse.body).id
        const almaResponse = await client.post('/api/food', alma)
        const almaId = JSON.parse(almaResponse.body).id

        const getResponse = await client.get('/api/food')
        expect(getResponse.code).toBe(200)

        const getResponseBody = JSON.parse(getResponse.body)
        sajt.id = sajtId
        alma.id = almaId

        expect(getResponseBody).toContainEqual(sajt)
        expect(getResponseBody).toContainEqual(alma)
    })
})