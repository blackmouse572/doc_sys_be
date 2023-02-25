import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { Document, Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  DirectFilterPipe,
  FilterBuilder,
  FilterDto,
  FilterOperationType,
} from 'src/shared';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('document')
@UseGuards(JwtGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiAcceptedResponse({ description: 'Document created' })
  @ApiBadRequestResponse({ description: 'Document not created' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDocumentDto })
  create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
    return this.documentService.create(createDocumentDto, req.user.username);
  }

  @Get()
  findAll(
    @Request() req,
    @Query() own: boolean,
    @Query(
      new DirectFilterPipe<Document, Prisma.DocumentWhereInput>(
        [
          'id',
          'type',
          'issueMark',
          'issuePublisherId',
          'dateRelease',
          'dataAvailable',
          'dateExpired',
          'description',
          'content',
          'createdAt',
          'updatedAt',
        ],
        [
          'id',
          'type',
          'issueMark',
          'issuePublisherId',
          'dateRelease',
          'dataAvailable',
          'dateExpired',
          'description',
          'content',
          'createdAt',
          'updatedAt',
        ],
      ),
    )
    filter: FilterDto<Prisma.DocumentWhereInput>,
    @Query('q') q: string,
  ) {
    if (q) {
      return this.documentService.findMany(
        q,
        filter.findOptions,
        own,
        req.user.username,
      );
    }
    return this.documentService.findAll(
      req.user.username,
      filter.findOptions,
      own,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.documentService.findOne(req.user.username, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Request() req,
  ) {
    return this.documentService.update(req.username, id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.documentService.remove(req.username, id);
  }
}
