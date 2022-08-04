const app = require('../app.js');
const request = require('supertest');
const seed = require('../db/seed');
const db = require('../db');
const data = require('../db/data');

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe('/api/snacks', () => {
  describe('GET', () => {
    test('status:200 responds with array of snacks', () => {
      return request(app)
        .get('/api/snacks')
        .expect(200)
        .then(({ body: { snacks } }) => {
          expect(snacks).toHaveLength(5);
        });
    });
    test('status:200 default sort order is snacks alphabetically', () => {
      return request(app)
        .get('/api/snacks')
        .expect(200)
        .then(({ body: { snacks } }) => {
          expect(snacks).toBeSortedBy('snack_name');
        });
    });
    test('status:200 accepts sort_by query to change order of data', () => {
      return request(app)
        .get('/api/snacks?sort_by=rating')
        .expect(200)
        .then(({ body: { snacks } }) => {
          expect(snacks).toBeSortedBy('rating');
        });
    });
    test('status:400 responds with bad request for invalid sort_by query', () => {
      return request(app)
        .get('/api/snacks?sort_by=banana')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('bad request');
        });
    });
    test('status:200 accepts min_rating query which filter the data', () => {
      return request(app)
        .get('/api/snacks?min_rating=3')
        .expect(200)
        .then(({ body: { snacks } }) => {
          expect(snacks).toHaveLength(3);
        });
    });
  });
});
describe('/api/categories/:category_id/snacks', () => {
  describe('GET', () => {
    test("status:200 responds with an array of snacks who's category all match the passed id", async () => {
      const {
        body: { snacks },
      } = await request(app).get('/api/categories/1/snacks').expect(200);

      expect(snacks).toHaveLength(3);
      snacks.forEach((snack) => {
        expect(snack.category_id).toBe(1);
        expect(snack.snack_name).toEqual(expect.any(String));
        expect(snack.flavour_text).toEqual(expect.any(String));
        expect(snack.rating).toEqual(expect.any(Number));
      });
    });
    test('status:200 responds with an empty array for existent category with no snacks', async () => {
      const {
        body: { snacks },
      } = await request(app).get('/api/categories/3/snacks').expect(200);

      expect(snacks).toHaveLength(0);
    });
    test('status:404 responds with error message for valid by non-existent category_id', async () => {
      const {
        body: { msg },
      } = await request(app).get('/api/categories/4/snacks').expect(404);

      expect(msg).toBe('category_id not found');
    });
  });
});
