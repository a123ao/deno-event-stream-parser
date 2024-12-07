export interface EventStreamData {
  event?: string;
  data?: string;
}

/**
 * A parser for EventStream data
 * @example
 * const response = await fetch("https://example.com/stream");
 * const stream = response.body;
 * 
 * for await (const { event, data } of EventStreamParser.parse(stream)) {
 *   console.log("Event:", event); // Print the value for "event:"
 *   console.log("Data:", data); // Print the value for "data:"
 * }
 * 
 * @see https://github.com/a123ao/deno-event-stream-parser
 */
export class EventStreamParser {
  /**
   * Parse an EventStream from a ReadableStream<Uint8Array>
   * @param stream A readable stream of Uint8Array data
   * @param options Options for the parser, e.g., custom delimiter
   * @returns An async generator of the parsed data
   */
  public static async *parse(
    stream: ReadableStream<Uint8Array>,
    options: { delimiter?: string; log?: boolean; encoding?: string } = {},
  ) {
    const {
      delimiter = "\n\n",
      log = false,
      encoding = "utf-8",
    } = options;

    const reader = stream
      .pipeThrough(new TextDecoderStream(encoding, { fatal: true }))
      .getReader();

    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const parts = (buffer + value).split(delimiter);
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (log) console.log("Part:", part);
          yield EventStreamParser.parsePart(part);
        }
      }
    } catch (err) {
      console.error("Error parsing stream:", err);
      throw err;
    } finally {
      await reader.cancel();
    }
  }

  private static parsePart(part: string): EventStreamData {
    const lines = part.split("\n");

    const result: EventStreamData = {};
    for (const line of lines) {
      if (line.startsWith(":")) {
        continue;
      } else if (line.startsWith("event:")) {
        result.event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        result.data = line.slice(5).trim();
      }
    }

    return result;
  }
}
