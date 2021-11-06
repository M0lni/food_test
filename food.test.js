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
    it('get command works based on id', async () => {
        let sajt = {'name': 'sajt', 'calories':50}

        const postResponse = await client.post('/api/food', sajt)
        const sajtId = JSON.parse(postResponse.body).id

        const getResponse = await client.get('/api/food/' + sajtId)
        expect(getResponse.code).toBe(200)
        sajt.id = sajtId

        const getResponseBody = JSON.parse(getResponse.body)
        expect(getResponseBody).toEqual(sajt)
    })
    it('returns error for invalid id for GET', async () => {
        const getResponse = await client.get('/api/food/invalid')
        expect(getResponse.code).toBe(404)
    })
    it ('updateable food', async () => {
        let sajt = {'name': 'sajt', 'calories':50}

        const postResponse = await client.post('/api/food', sajt)
        const sajtId = JSON.parse(postResponse.body).id
        sajt.id = sajtId

        sajt.name = 'SAJT'
        sajt.calories=800
        const putResponse = await client.put('/api/food/' + sajtId, sajt)
        expect(putResponse.code).toBe(200)

        const putResponseBody = JSON.parse(putResponse.body)
        expect(putResponseBody).toEqual(sajt)

        const getResponse = await client.get('/api/food/' + sajtId)
        expect(getResponse.code).toBe(200)
        sajt.id = sajtId

        const getResponseBody = JSON.parse(getResponse.body)
        expect(getResponseBody).toEqual(sajt)

    })
    it('returns error for invalid id for PUT', async () => {
        let sajt = {'name': 'sajt', 'calories':50}

        const postResponse = await client.post('/api/food', sajt)
        
        
        const putResponse = await client.put('/api/food/abcd', sajt)
        expect(putResponse.code).toBe(404)                                  


    })
    it ('deletable food', async () => {
        let sajt = {'name': 'sajt', 'calories':50}

        const postResponse = await client.post('/api/food', sajt)
        const sajtId = JSON.parse(postResponse.body).id
        sajt.id = sajtId

        const deleteResponse = await client.delete('/api/food/' + sajt.id)
        expect(deleteResponse.code).toBe(204)

        const getResponse = await client.get('/api/food')
        expect(JSON.parse(getResponse.body)).toEqual(expect.not.arrayContaining([sajt]))

        const getResponse1 = await client.get('/api/food/sajtId')
        expect(getResponse1.code).toBe(404)
    })
})