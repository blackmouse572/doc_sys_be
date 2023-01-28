import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
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
  findAll(@Request() req) {
    return this.documentService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.documentService.findOne(req.user.id, id);
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
