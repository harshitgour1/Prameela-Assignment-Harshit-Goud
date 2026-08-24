import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should build correct where clause when search is omitted', async () => {
      (prisma.company.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.company.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });

    it('should build correct where clause when search is provided', async () => {
      (prisma.company.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.company.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ search: 'acme', page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { companyName: { contains: 'acme', mode: 'insensitive' } },
        }),
      );
    });

    it('should correctly compute skip and take from page and limit', async () => {
      (prisma.company.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.company.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ page: 3, limit: 15, sortBy: 'createdAt', sortOrder: 'desc' });

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 30, // (3 - 1) * 15
          take: 15,
        }),
      );
    });

    it('should apply the default sort', async () => {
      (prisma.company.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.company.count as jest.Mock).mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        }),
      );
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when deleting non-existent id', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Not found', { code: 'P2025', clientVersion: '7' });
      (prisma.company.delete as jest.Mock).mockRejectedValue(error);

      await expect(service.remove('uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
