import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('CompaniesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.company.deleteMany();
    await app.close();
  });

  let createdId: string;

  it('/companies (POST) - valid', async () => {
    const res = await request(app.getHttpServer())
      .post('/companies')
      .send({
        companyName: 'Acme Test Corp',
        website: 'https://acme-test.com',
        industry: 'Software',
        employeeCount: 42,
      })
      .expect(201);

    const body = res.body as { data: Record<string, unknown> };
    expect(body.data).toHaveProperty('id');
    expect(body.data.companyName).toBe('Acme Test Corp');
    createdId = body.data.id as string;
  });

  it('/companies (POST) - invalid', async () => {
    const res = await request(app.getHttpServer())
      .post('/companies')
      .send({
        companyName: '',
        website: 'not-a-url',
        industry: 'Software',
        employeeCount: -5,
      })
      .expect(400);

    const body = res.body as { message: string[] };
    expect(body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining('website'),
        expect.stringContaining('employeeCount'),
        expect.stringContaining('companyName'),
      ]),
    );
  });

  it('/companies (GET) - search', async () => {
    const res = await request(app.getHttpServer())
      .get('/companies?search=Acme')
      .expect(200);

    const body = res.body as {
      data: Record<string, unknown>[];
      meta: { totalItems: number };
    };
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].companyName).toBe('Acme Test Corp');
    expect(body.meta.totalItems).toBeGreaterThan(0);
  });

  it('/companies (GET) - pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/companies?page=1&limit=1')
      .expect(200);

    const body = res.body as {
      data: Record<string, unknown>[];
      meta: { limit: number; page: number };
    };
    expect(body.data.length).toBeLessThanOrEqual(1);
    expect(body.meta.limit).toBe(1);
    expect(body.meta.page).toBe(1);
  });

  it('/companies/:id (DELETE) - existing', async () => {
    await request(app.getHttpServer())
      .delete(`/companies/${createdId}`)
      .expect(204);

    // Verify it's gone
    const check = await prisma.company.findUnique({ where: { id: createdId } });
    expect(check).toBeNull();
  });

  it('/companies/:id (DELETE) - missing company', async () => {
    await request(app.getHttpServer())
      .delete('/companies/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});
