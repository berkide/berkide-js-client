// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type {
  ClientOptions,
  BerkideEvent,
  BerkideEventMap,
} from "./types.js";
import { HttpTransport } from "./http.js";
import { WsTransport } from "./ws.js";
import { ServerAPI } from "./endpoints/server.js";
import { BufferAPI } from "./endpoints/buffer.js";
import { BuffersAPI } from "./endpoints/buffers.js";
import { CursorAPI } from "./endpoints/cursor.js";
import { CommandAPI } from "./endpoints/command.js";
import { InputAPI } from "./endpoints/input.js";
import { StateAPI } from "./endpoints/state.js";
import { HelpAPI } from "./endpoints/help.js";

/**
 * BerkIDE JavaScript client — connects to a berkide-core server via HTTP + WebSocket.
 * BerkIDE JavaScript istemcisi — HTTP + WebSocket ile berkide-core sunucusuna bağlanır.
 *
 * @example
 * ```typescript
 * import { BerkideClient } from "@berkide/js-client";
 *
 * const client = new BerkideClient({
 *   url: "http://127.0.0.1:1881",
 *   token: "my-secret-token",
 * });
 *
 * // HTTP — request/response
 * const alive = await client.server.ping();
 * const buf = await client.buffer.get();
 * await client.command.exec("file.save");
 *
 * // WebSocket — real-time events
 * client.connect();
 * client.on("bufferChanged", (e) => console.log(e.filePath));
 * client.on("cursorMoved", (e) => console.log(e.line, e.col));
 * ```
 */
export class BerkideClient {
  private http: HttpTransport;
  private ws: WsTransport;

  /** Server status and discovery / Sunucu durumu ve keşif */
  readonly server: ServerAPI;
  /** Active buffer operations / Aktif buffer işlemleri */
  readonly buffer: BufferAPI;
  /** Multi-buffer management / Çoklu buffer yönetimi */
  readonly buffers: BuffersAPI;
  /** Cursor position queries / İmleç konum sorguları */
  readonly cursor: CursorAPI;
  /** Command dispatch (267 commands) / Komut gönderimi (267 komut) */
  readonly command: CommandAPI;
  /** Keyboard input simulation / Klavye girişi simülasyonu */
  readonly input: InputAPI;
  /** Full editor state snapshot / Tam editör durum görüntüsü */
  readonly state: StateAPI;
  /** Help system access / Yardım sistemi erişimi */
  readonly help: HelpAPI;

  /**
   * Create a new BerkideClient instance.
   * Yeni bir BerkideClient örneği oluştur.
   *
   * @param options - Connection options / Bağlantı seçenekleri
   */
  constructor(options: ClientOptions) {
    const { url, token, reconnect, reconnectInterval, maxReconnectAttempts } =
      options;

    // Derive WebSocket URL from HTTP URL if not provided
    // Verilmemişse HTTP URL'den WebSocket URL'i türet
    const wsUrl =
      options.wsUrl ?? url.replace(/^http/, "ws").replace(/:\d+/, ":1882");

    this.http = new HttpTransport(url, token);
    this.ws = new WsTransport(
      wsUrl,
      token,
      reconnect ?? true,
      reconnectInterval ?? 2000,
      maxReconnectAttempts ?? Infinity
    );

    this.server = new ServerAPI(this.http);
    this.buffer = new BufferAPI(this.http);
    this.buffers = new BuffersAPI(this.http);
    this.cursor = new CursorAPI(this.http);
    this.command = new CommandAPI(this.http);
    this.input = new InputAPI(this.http);
    this.state = new StateAPI(this.http);
    this.help = new HelpAPI(this.http);
  }

  /**
   * Open WebSocket connection for real-time events.
   * Gerçek zamanlı olaylar için WebSocket bağlantısı aç.
   */
  connect(): void {
    this.ws.connect();
  }

  /**
   * Close WebSocket connection.
   * WebSocket bağlantısını kapat.
   */
  disconnect(): void {
    this.ws.disconnect();
  }

  /** Whether WebSocket is currently connected / WebSocket şu an bağlı mı */
  get connected(): boolean {
    return this.ws.connected;
  }

  /**
   * Subscribe to a real-time event.
   * Gerçek zamanlı bir olaya abone ol.
   *
   * @param event    - Event name / Olay adı
   * @param listener - Callback function / Geri çağırma fonksiyonu
   *
   * @example
   * ```typescript
   * client.on("bufferChanged", (e) => {
   *   console.log("File changed:", e.filePath);
   * });
   * ```
   */
  on<E extends BerkideEvent>(
    event: E,
    listener: (data: BerkideEventMap[E]) => void
  ): void {
    this.ws.on(event, listener);
  }

  /**
   * Unsubscribe from an event.
   * Bir olay aboneliğini iptal et.
   *
   * @param event    - Event name / Olay adı
   * @param listener - Callback to remove / Kaldırılacak geri çağırma
   */
  off<E extends BerkideEvent>(
    event: E,
    listener: (data: BerkideEventMap[E]) => void
  ): void {
    this.ws.off(event, listener);
  }

  /**
   * Request full state sync over WebSocket.
   * WebSocket üzerinden tam durum senkronizasyonu iste.
   */
  requestSync(): void {
    this.ws.requestSync();
  }
}
