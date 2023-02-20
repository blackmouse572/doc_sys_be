import {
  DocType,
  Document as DocumentEntity,
  IssueMarkType,
  DocumentReceiveDetail as DocumentReceiveDetailEntity,
  DocumentReceiveGroup as DocumentReceiveGroupEntity,
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
export class DocumentReceiveDetail implements DocumentReceiveDetailEntity  {
  id: string
  documentId: string
  userId: string
  date_receive: Date
  isRead: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
export class DocumentReceiveGroup implements DocumentReceiveGroupEntity  {
  id: string
  documentId: string
  groupId: string;
  date_receive: Date
  isRead: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}