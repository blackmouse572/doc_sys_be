import { Test, TestingModule } from '@nestjs/testing';
import { DocType, IssueMarkType } from '@prisma/client';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentService],
    })
      .useMocker((token) => {
        if (token === DocumentService) {
          const resultDocument: Document[] = [
            {
              id: '1',
              description: 'test',
              content: 'test',
              dateRelease: new Date(),
              dataAvailable: new Date(),
              issueGroupId: '1',
              issueMark: IssueMarkType.Ban_Giam_Doc,
              issuePublisherId: '1',
              issueRoleId: '1',
              sentDepartment: 'test',
              sentOrganization: 'test',
              type: DocType.Bao_Cao,
              dateExpired: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];
          return {
            getDocument: () => resultDocument,
          };
        }
      })
      .compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
