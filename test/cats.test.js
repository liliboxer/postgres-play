require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const client = require('../lib/utils/client');
const child_process = require('child_process');

describe('cats routes', () => {
  beforeEach(() => {
    child_process.execSync('npm run recreate-tables');
  });

  afterAll(() => {
    client.end();
  });

  const TEST_CAT = {
    owner: 'lili',
    name: 'max',
    type: 'orange tabby'
  };

  const createCat = (cat = TEST_CAT) => request(app)
    .post('/api/v1/cats')
    .expect(200)
    .send(cat);

  const testCat = cat => {
    expect(cat).toEqual({
      id: expect.any(Number),
      owner: 'lili',
      name: 'max',
      type: 'orange tabby'
    });
  };

  it('creates cat', () => {
    return createCat()
      .then(({ body }) => {
        testCat(body);
      });
  });

  it('gets a cat by id', () => {
    return createCat()
      .then(({ body }) => {
        return request(app)
          .get(`/api/v1/cats/${body.id}`)
          .expect(200);
      })
      .then(({ body }) => {
        testCat(body);
      });
  });

  it('returns 404 on non-existant id', () => {
    return request(app)
      .get('/api/v1/cats/100')
      .expect(404);
  });

  it('gets a list of cats', () => {
    return Promise.all([
      createCat({ owner: 'lili', name: 'max', type: 'orange tabby' }),
      createCat({ owner: 'brittany', name: 'bud', type: 'black cat' }),
      createCat({ owner: 'nate', name: 'toots', type: 'maine coon' }),
    ])
      .then(() => {
        return request(app)
          .get('/api/v1/cats')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(3);
          });
      });
  });

  it('updates a cat', () => {
    return createCat()
      .then(({ body }) => {
        body.owner = 'brittany';
        return request(app)
          .put(`/api/v1/cats/${body.id}`)
          .send(body)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.owner).toBe('brittany');
      });
  });

  it('deletes cat', () => {
    return createCat()
      .then(({ body }) => {
        return request(app)
          .delete(`/api/v1/cats/${body.id}`)
          .expect(200)
          .then(({ body: removed }) => {
            expect(removed).toEqual(body);
            return body.id;
          });
      })
      .then(id => {
        return request(app)
          .get(`/api/v1/cats/${id}`)
          .expect(404);
      });
  });


});
