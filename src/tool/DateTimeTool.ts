import z from 'zod'
import { BaseTool } from './BaseTool.js'

const DateTimeToolInputSchema = z.object({
  withTime: z.boolean().default(false).describe('Whether to include time in the output'),
})
export type DateTimeToolInput = z.infer<typeof DateTimeToolInputSchema>

const DateTimeToolOutputSchema = z.object({
  dateTimeISO: z.string().describe('Current date and (if requested) time in ISO 8601 format'),
})
export type DateTimeToolOutput = z.infer<typeof DateTimeToolOutputSchema>

export class DateTimeTool extends BaseTool<DateTimeToolInput, DateTimeToolOutput> {
  constructor() {
    super({
      toolPathName: 'date_time',
      description: 'A tool for retrieving the current date and time',
      inputSchema: DateTimeToolInputSchema,
      outputSchema: DateTimeToolOutputSchema,
    })
  }

  execute(parameters: DateTimeToolInput): Promise<DateTimeToolOutput> {
    const { withTime } = parameters
    const now = new Date()
    return Promise.resolve(
      DateTimeToolOutputSchema.parse({
        dateTimeISO: withTime ? now.toISOString() : now.toISOString().split('T')[0],
      }),
    )
  }
}
