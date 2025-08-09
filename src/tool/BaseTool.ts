import { McpServer } from '@mzyil/mcp-typescript-sdk/server/mcp.js'
import { TextContentSchema, type CallToolResult } from '@mzyil/mcp-typescript-sdk/types.js'
import { z } from 'zod'

export abstract class BaseTool<Input, Output> {
  protected toolPathName: string
  protected description: string
  protected inputSchema: z.ZodSchema<Input>
  protected outputSchema: z.ZodSchema<Output> | undefined

  constructor(options: {
    toolPathName?: string
    title?: string
    description: string
    inputSchema: z.ZodSchema<Input>
    outputSchema?: z.ZodSchema<Output>
  }) {
    if (!options.toolPathName) {
      console.warn('Tool path name is not defined, defaulting to class name:', this.constructor.name)
      this.toolPathName = this.constructor.name
    } else {
      this.toolPathName = options.toolPathName
    }
    this.description = options.description
    this.inputSchema = options.inputSchema
    this.outputSchema = options.outputSchema
    if (!this.description) {
      throw new Error('Description is not defined')
    }
    if (!this.inputSchema) {
      throw new Error('Input schema is not defined')
    }
    if (!this.outputSchema) {
      throw new Error('Output schema is not defined')
    }
  }

  abstract execute(parameters: Input): Promise<Output>

  registerTool(server: McpServer): void {
    // Ensure we have valid values before passing to registerTool
    const description = this.description // We already checked this in constructor
    const inputSchema = this.inputSchema // We already checked this in constructor
    const outputSchema = this.outputSchema! // We already checked this in constructor

    server.registerTool(
      this.toolPathName,
      {
        description,
        inputSchema,
        outputSchema,
      },
      async (input: Input): Promise<CallToolResult> => {
        const result = await this.execute(input)
        return {
          content: [
            TextContentSchema.parse({
              type: 'text',
              text: JSON.stringify(result),
            }),
          ],
          structuredContent: result as Record<string, unknown>,
        }
      },
    )
  }
}
