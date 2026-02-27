// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

// Main client class / Ana istemci sınıfı
export { BerkideClient } from "./client.js";

// All public types / Tüm açık tipler
export type {
  ClientOptions,
  ApiResponse,
  CursorPosition,
  BufferData,
  BufferInfo,
  EditorState,
  LineData,
  ServerInfo,
  EndpointInfo,
  CommandRequest,
  HelpEntry,
  HelpArticle,
  EditAction,
  EditRequest,
  BerkideEvent,
  BerkideEventMap,
  BufferChangedEvent,
  CursorMovedEvent,
  TabChangedEvent,
} from "./types.js";
