import * as fs from 'fs';
import { Format } from 'convict';

function checkFile(filePath: string | undefined): void {
  if (!filePath) {
    return;
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
}

export interface SchemaFormats {
  [key: string]: Format;
}

export const schemaFormats: SchemaFormats = {
  optionalFile: {
    validate: checkFile,
    coerce: (val) => String(val),
  },
};
