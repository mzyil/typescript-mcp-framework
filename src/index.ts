import { McpServer } from '@mzyil/mcp-typescript-sdk/server/mcp.js'
import { StdioServerTransport } from '@mzyil/mcp-typescript-sdk/server/stdio.js'
import { DateTimeTool } from './tool/DateTimeTool.js'

const server = new McpServer({
  name: 'demo-server',
  version: '1.0.0',
})

new DateTimeTool().registerTool(server)

await server.connect(new StdioServerTransport())

