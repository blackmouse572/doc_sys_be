import {
  DocType,
  Document as DocumentEntity,
  IssueMarkType,
} from '@prisma/client';
export class Document implements DocumentEntity {
  id: string;
  type: DocType;
  issueMark: IssueMarkType;
  issuePublisherId: string;
  dateRelease: Date;
  dataAvailable: Date;
  dateExpired: Date;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
