# Deno Event Stream Parser

A lightweight, flexible parser for Server-Sent Events (SSE) streams in Deno.

## Installation

Import directly from GitHub:

```typescript
import { EventStreamParser } from 'https://raw.githubusercontent.com/a123ao/deno-event-stream-parser/main/src/mod.ts';
```

## Usage

```typescript
// Example usage
const response = await fetch('https://example.com/events');
for await (const { event, data } of EventStreamParser.parse(response.body)) {
  console.log(event);
}
```

## Features

- Parse Server-Sent Events streams
- Customizable delimiter
- Logging option
- Different encoding support

## License

MIT
