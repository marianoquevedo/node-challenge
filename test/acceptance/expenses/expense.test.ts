import { Api } from '../utils/api';

// this user has 3 expenses mapped in dump.sql
const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';

// this user has no expenses mapped in dump.sql
const userIdEmpty = '51f023a3-1868-491e-8608-23227d59b72e';

describe('GET /expenses/v1/', () => {
  test('should return 200 and filter by userId', (done) => {
    Api.get('/expenses/v1')
      .query({
        userId,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.expenses.length).toBe(3);
        expect(response.body.expenses[0]).not.toHaveProperty('userId');
        done();
      })
      .catch((err) => done(err));
  });

  test('should return 200 and empty rows if user has no expenses', (done) => {
    Api.get('/expenses/v1')
      .query({
        userId: userIdEmpty,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.expenses.length).toBe(0);
        done();
      })
      .catch((err) => done(err));
  });

  test('should return 404 if user is not found', (done) => {
    Api.get('/expenses/v1')
      .query({
        userId: 'd0cf8bd6-25a0-403b-95f7-c884b2022de7',
      })
      .expect(404, done);
  });

  describe('Validation', () => {
    test('should return 400 if missing userId', (done) => {
      Api.get('/expenses/v1')
        .expect(400, done);
    });

    test('should return 400 if invalid userId', (done) => {
      Api.get('/expenses/v1/')
        .query({
          userId: 'no-valid-uuid',
        })
        .expect(400, done);
    });

    test('should return 400 if invalid offset', (done) => {
      Api.get('/expenses/v1/')
        .query({
          userId,
          offset: -2,
        })
        .expect(400, done);
    });

    test('should return 400 if invalid limit', (done) => {
      Api.get('/expenses/v1/')
        .query({
          userId,
          offset: 10,
          limit: -2,
        })
        .expect(400, done);
    });

    test('should return 400 if invalid status', (done) => {
      Api.get('/expenses/v1/')
        .query({
          userId,
          status: 'ready',
        })
        .expect(400, done);
    });
  });

  describe('Sorting', () => {
    test('should return 400 if field not in sorting whitelist', (done) => {
      Api.get('/expenses/v1/')
        .query({
          userId,
          sort: 'currency',
        })
        .expect(400, done);
    });

    test('should return 400 if sortDir not valid', (done) => {
      Api.get('/expenses/v1/')
        .query({
          userId,
          sortDir: 'left',
        })
        .expect(400, done);
    });

    test('should sort by amount_in_cents, default DESC', (done) => {
      Api.get('/expenses/v1')
        .query({
          userId,
          sort: 'amount_in_cents',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.expenses[0].amount_in_cents).toBe(12000);
          done();
        })
        .catch((err) => done(err));
    });

    test('should sort by amount_in_cents, passing ASC', (done) => {
      Api.get('/expenses/v1')
        .query({
          userId,
          sort: 'amount_in_cents',
          sortDir: 'ASC',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.expenses[0].amount_in_cents).toBe(6000);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('Filtering', () => {
    test('should return 400 if merchant_name empty', (done) => {
      Api.get('/expenses/v1/')
        .query({
          userId,
          merchant_name: '',
        })
        .expect(400, done);
    });

    test('should return 400 if status empty', (done) => {
      Api.get('/expenses/v1/')
        .query({
          userId,
          status: '',
        })
        .expect(400, done);
    });

    test('should do a fuzzy filter by merchant_name', (done) => {
      Api.get('/expenses/v1')
        .query({
          userId,
          merchant_name: 'caf',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.expenses.length).toBe(1);
          expect(response.body.expenses[0].merchant_name).toBe('Cafe 22');
          done();
        })
        .catch((err) => done(err));
    });

    test('should filter by status', (done) => {
      Api.get('/expenses/v1')
        .query({
          userId,
          status: 'processed',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.expenses.length).toBe(2);
          expect(response.body.expenses[0].status).toBe('processed');
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('Pagination', () => {
    test('should set default values for pagination', (done) => {
      Api.get('/expenses/v1')
        .query({
          userId,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.expenses.length).toBe(3);
          expect(response.body.pagination).toEqual({
            limit: 20,
            offset: 0,
            total: 3,
          });
          done();
        })
        .catch((err) => done(err));
    });

    test('should return paginated results - offset', (done) => {
      Api.get('/expenses/v1')
        .query({
          userId,
          offset: 1,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.expenses.length).toBe(2);
          expect(response.body.pagination).toEqual({
            limit: 20,
            offset: 1,
            total: 3,
          });
          done();
        })
        .catch((err) => done(err));
    });

    test('should return paginated results - limit', (done) => {
      Api.get('/expenses/v1')
        .query({
          userId,
          limit: 2,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.expenses.length).toBe(2);
          expect(response.body.pagination).toEqual({
            limit: 2,
            offset: 0,
            total: 3,
          });
          done();
        })
        .catch((err) => done(err));
    });
  });
});
