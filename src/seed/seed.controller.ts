import { Controller, Get } from '@nestjs/common';
import * as xlsx from 'xlsx';

@Controller()
export class SeedController {
  @Get('/seed')
  async createSeedData() {
    const workbook = xlsx.readFile('./src/seed/ACCOUNT_TABLE_DOCSYS.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // console.log(data);

    const records = [];

    data.forEach((row) => {
      if (Object.keys(row).length > 3) records.push(row);
    });

    // Create a new workbook
    const workbook2 = xlsx.utils.book_new();

    // Create a new worksheet and add data
    const worksheet2 = xlsx.utils.json_to_sheet(records);
    xlsx.utils.book_append_sheet(workbook2, worksheet2, 'Data');

    // Save workbook2 to file
    xlsx.writeFile(workbook2, './src/seed/data.xlsx');

    return 'Seed data created';
  }
}
