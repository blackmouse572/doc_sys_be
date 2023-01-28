import {
  DocType,
  Document as DocumentEntity,
  IssueMarkType,
} from '@prisma/client';
export class Document implements DocumentEntity {
  id: string;
  type: DocType;
  issueMark: IssueMarkType;
  issueGroupId: string;
  issuePublisherId: string;
  issueRoleId: string;
  dateRelease: Date;
  dataAvailable: Date;
  dateExpired: Date;
  description: string;
  content: string;
  sentOrganization: string;
  sentDepartment: string;
  createdAt: Date;
  updatedAt: Date;
}
