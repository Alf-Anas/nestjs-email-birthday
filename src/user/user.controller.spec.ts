import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (POST)', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        birthday: '1990-01-01',
        location: 'Asia/Jakarta',
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.first_name).toEqual('John');
        expect(response.body.last_name).toEqual('Doe');
      });
  });

  it('/user/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/user/1')
      .send({
        first_name: 'Updated John',
        last_name: 'Updated Doe',
        birthday: '1990-01-02',
        location: 'Asia/Jayapura',
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.first_name).toEqual('Updated John');
        expect(response.body.last_name).toEqual('Updated Doe');
      });
  });

  it('/user/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/user/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.message).toEqual('User deleted successfully');
      });
  });
});
