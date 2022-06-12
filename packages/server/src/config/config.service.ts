import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor(filePath: string) {
    try {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
      dotenvExpand.expand({
        parsed: this.envConfig,
      });
    } catch {
      this.envConfig = {};
    }
  }

  get(key: string): string {
    return this.envConfig[key] ? this.envConfig[key] : process.env[key];
  }
}
