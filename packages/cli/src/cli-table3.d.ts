declare module "cli-table3" {
  interface TableOptions {
    head?: string[];
    colWidths?: number[];
    style?: {
      head?: string[];
      border?: string[];
    };
  }

  class Table {
    constructor(options?: TableOptions);
    push(...rows: (string | number)[][]): void;
    toString(): string;
  }

  export = Table;
}
