import { McpServer } from '@mzyil/mcp-typescript-sdk/server/mcp.js'
import { Implementation } from '@mzyil/mcp-typescript-sdk/types.js'
import { ServerOptions } from '@mzyil/mcp-typescript-sdk/server/index.js'
import { BaseTool } from './tool/BaseTool.js'
import { Transport } from '../mcp-typescript-sdk/dist/cjs/shared/transport.js'

export class Server<T extends new () => BaseTool<unknown, unknown>> {
  private _sdkServer: McpServer | null = null

  constructor(
    private readonly tools: T[],
    private readonly serverMetadata: Implementation,
    private readonly serverOptions?: ServerOptions,
  ) {}

  get sdkServer(): McpServer {
    if (!this._sdkServer) {
      this._sdkServer = new McpServer(this.serverMetadata, this.serverOptions)
      this.registerTools(this._sdkServer)
    }
    return this._sdkServer
  }

  async connect(transport: Transport): Promise<void> {
    return await this.sdkServer.connect(transport)
  }

  private registerTools(sdkServer: McpServer) {
    this.tools.forEach((Tool) => {
      const toolInstance = new Tool()
      toolInstance.registerTool(sdkServer)
    })
  }
}
