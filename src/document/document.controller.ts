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
  ApiQuery,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { DirectFilterPipe, FilterDto } from 'src/shared';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';

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
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by content or description',
  })
  @ApiQuery({
    name: 'own',
    required: false,
    description: 'Get own document',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter by field',
  })
  @ApiAcceptedResponse({
    description: 'Get all document',
    isArray: true,
    type: Document,
  })
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
          'issueGroupId',
          'issuePublisherId',
          'dateRelease',
          'dataAvailable',
          'dateExpired',
          'description',
          'content',
          'createdAt',
          'updatedAt',
          'sentDepartment',
        ],
      ),
    )
    filter: FilterDto<Prisma.DocumentWhereInput>,
    @Query('q') q: string,
  ) {
    return this.documentService.findMany(
      filter.findOptions,
      q,
      own,
      req.user.username,
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
    return this.documentService.update(req.user.id, id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.documentService.remove(req.user.id, id);
  }
}
