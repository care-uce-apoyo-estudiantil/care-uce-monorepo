import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TriageService } from './triage.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post()
  create(@Request() req: any, @Body() createTriageDto: CreateTriageDto) {
    // 🔥 Extraemos el userId directamente del JWT validado
    const studentId = req.user.userId;
    return this.triageService.create(studentId, createTriageDto);
  }

  @Get()
  findAll() {
    return this.triageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.triageService.findOne(id);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.triageService.findByStudent(studentId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTriageDto: UpdateTriageDto) {
    return this.triageService.update(id, updateTriageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.triageService.remove(id);
  }
}
