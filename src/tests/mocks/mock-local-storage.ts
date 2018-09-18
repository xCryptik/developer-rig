export class LocalStorage {
  constructor() {
    this.self = {};
  }

  private self: {
    [key: string]: string;
  };

  public getItem(key: string): string | null {
    return key in this.self ? this.self[key] : null;
  }

  public removeItem(key: string, value: string) {
    delete this.self[key];
  }

  public setItem(key: string, value: string) {
    this.self[key] = value;
  }
}
