export abstract class BaseTool {
  abstract execute(): Promise<void>;
}