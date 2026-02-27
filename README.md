# @berkide/js-client

No impositions.

JavaScript/TypeScript client for [berkide-core](https://github.com/berkide/berkide-core) headless editor server.

Zero dependencies. Works in browser and Node.js 18+.

## Install

```bash
npm install @berkide/js-client
```

## Quick Start

```typescript
import { BerkideClient } from "@berkide/js-client";

const client = new BerkideClient({
  url: "http://127.0.0.1:1881",
  token: "my-secret-token",       // optional — required if server auth is enabled
});

// Health check
const alive = await client.server.ping(); // true

// Get editor state
const state = await client.state.get();
console.log(state.data.cursor);  // { line: 0, col: 0 }
console.log(state.data.mode);    // "normal"

// Execute a command (267 commands available)
await client.command.exec("file.save");
await client.command.exec("cursor.goto", { line: 10, col: 0 });
await client.command.exec("edit.undo");
```

## API

### HTTP — Request/Response

All HTTP methods return `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  ok: boolean;
  data: T;
  meta: Record<string, unknown> | null;
  error: string | null;
  message: string | null;
}
```

#### `client.server`

| Method | Description |
|--------|-------------|
| `ping()` | Health check — returns `true` if alive |
| `info()` | Server info (version, ports, TLS, auth) |
| `endpoints()` | List all registered HTTP endpoints |

#### `client.command`

| Method | Description |
|--------|-------------|
| `exec(cmd, args?)` | Execute any command (e.g. `"file.save"`, `"cursor.up"`) |
| `list()` | List all 267 registered commands |

#### `client.buffer`

| Method | Description |
|--------|-------------|
| `get()` | Active buffer content + metadata |
| `line(n)` | Get single line by number |
| `edit(req)` | Edit buffer (insert, delete, insertLine, deleteLine) |
| `open(path)` | Open a file |
| `save()` | Save active buffer |
| `close()` | Close active buffer |

#### `client.buffers`

| Method | Description |
|--------|-------------|
| `list()` | List all open buffers |
| `switchTo(index)` | Switch to a buffer by index |

#### `client.cursor`

| Method | Description |
|--------|-------------|
| `position()` | Current cursor position (line, col) |

#### `client.input`

| Method | Description |
|--------|-------------|
| `key(key)` | Simulate key press (e.g. `"Enter"`, `"Ctrl+S"`) |
| `char(text)` | Insert raw text at cursor |

#### `client.state`

| Method | Description |
|--------|-------------|
| `get()` | Full editor state (cursor, buffer, mode, tabs) |

#### `client.help`

| Method | Description |
|--------|-------------|
| `list()` | List all help topics |
| `search(query)` | Search help by keyword |
| `topic(id)` | Get full help article |

### WebSocket — Real-Time Events

```typescript
// Connect
client.connect();

// Listen for events
client.on("bufferChanged", (e) => {
  console.log("File changed:", e.filePath);
  console.log("Cursor:", e.cursor.line, e.cursor.col);
});

client.on("cursorMoved", (e) => {
  console.log("Cursor:", e.line, e.col);
});

client.on("tabChanged", (e) => {
  console.log("Active tab:", e.activeIndex);
});

client.on("fullSync", (state) => {
  console.log("Full state received:", state.mode);
});

// Connection lifecycle
client.on("connected", () => console.log("WS connected"));
client.on("disconnected", () => console.log("WS disconnected"));
client.on("error", (err) => console.error(err));

// Request full state sync
client.requestSync();

// Disconnect
client.disconnect();
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `fullSync` | `EditorState` | Full state (on connect + manual sync) |
| `bufferChanged` | `{ filePath, cursor }` | Buffer content changed |
| `cursorMoved` | `{ line, col }` | Cursor position changed |
| `tabChanged` | `{ activeIndex }` | Active tab switched |
| `connected` | `void` | WebSocket connected |
| `disconnected` | `void` | WebSocket disconnected |
| `error` | `Error` | WebSocket error |

### Configuration

```typescript
const client = new BerkideClient({
  url: "http://127.0.0.1:1881",   // HTTP base URL (required)
  wsUrl: "ws://127.0.0.1:1882",   // WebSocket URL (optional, derived from url)
  token: "my-token",               // Bearer token (optional)
  reconnect: true,                  // Auto-reconnect (default: true)
  reconnectInterval: 2000,          // Reconnect delay ms (default: 2000)
  maxReconnectAttempts: Infinity,   // Max attempts (default: Infinity)
});
```

## Examples

### Open a file and read its content

```typescript
await client.buffer.open("/path/to/file.ts");
const buf = await client.buffer.get();
console.log(buf.data.lines.join("\n"));
```

### Insert text at a specific position

```typescript
await client.buffer.edit({
  action: "insert",
  text: "Hello, World!",
  line: 0,
  col: 0,
});
```

### Simulate vim-style navigation

```typescript
await client.input.key("j");     // move down
await client.input.key("j");     // move down
await client.input.key("l");     // move right
await client.input.key("i");     // enter insert mode
await client.input.char("x");    // type "x"
await client.input.key("Escape"); // back to normal mode
```

### Build a live editor UI

```typescript
client.connect();

// Initial state
const state = await client.state.get();
renderEditor(state.data);

// Live updates
client.on("bufferChanged", () => {
  client.state.get().then((s) => renderEditor(s.data));
});

client.on("cursorMoved", (e) => {
  updateCursorUI(e.line, e.col);
});
```

## Build

```bash
npm install
npm run build     # ESM + CJS dual output → dist/
```

## Related Projects

| Project | Description |
|---------|-------------|
| [berkide-core](https://github.com/berkide/berkide-core) | C++ headless editor engine |
| [berkide-plugins](https://github.com/berkide/berkide-plugins) | Official plugin collection |
| [berkide-tui](https://github.com/berkide/berkide-tui) | Terminal UI client |
| [berkidectl](https://github.com/berkide/berkidectl) | CLI management tool |

## License

MIT
