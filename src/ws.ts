// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type {
  BerkideEvent,
  BerkideEventMap,
  WsMessage,
  CommandRequest,
} from "./types.js";

type Listener<T> = (data: T) => void;

/**
 * WebSocket transport with auto-reconnect and typed events.
 * Otomatik yeniden bağlanma ve tipli olaylar ile WebSocket aktarım katmanı.
 *
 * Listens for server-pushed events (bufferChanged, cursorMoved, tabChanged)
 * and supports command dispatch over WebSocket.
 * Sunucudan gelen olayları dinler (bufferChanged, cursorMoved, tabChanged)
 * ve WebSocket üzerinden komut göndermeyi destekler.
 */
export class WsTransport {
  private url: string;
  private token: string | undefined;
  private reconnectEnabled: boolean;
  private reconnectInterval: number;
  private maxAttempts: number;
  private attempt = 0;
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener<unknown>>>();
  private closed = false;

  /**
   * @param url               - WebSocket URL (e.g. "ws://127.0.0.1:1882")
   *                            WebSocket adresi (ör. "ws://127.0.0.1:1882")
   * @param token             - Bearer token (sent as query param)
   *                            Bearer token (query param olarak gönderilir)
   * @param reconnect         - Auto-reconnect on disconnect (default: true)
   *                            Koptuğunda otomatik yeniden bağlan (varsayılan: true)
   * @param reconnectInterval - Reconnect delay in ms (default: 2000)
   *                            Yeniden bağlanma gecikmesi, ms (varsayılan: 2000)
   * @param maxAttempts       - Max reconnect attempts (default: Infinity)
   *                            Maks yeniden bağlanma denemesi (varsayılan: sınırsız)
   */
  constructor(
    url: string,
    token?: string,
    reconnect = true,
    reconnectInterval = 2000,
    maxAttempts = Infinity
  ) {
    this.url = url.replace(/\/+$/, "");
    this.token = token;
    this.reconnectEnabled = reconnect;
    this.reconnectInterval = reconnectInterval;
    this.maxAttempts = maxAttempts;
  }

  /**
   * Open WebSocket connection.
   * WebSocket bağlantısını aç.
   */
  connect(): void {
    if (this.ws) return;
    this.closed = false;

    // Token is sent as query parameter for WS auth
    // Token, WS kimlik doğrulaması için query param olarak gönderilir
    const endpoint = this.token
      ? `${this.url}/?token=${encodeURIComponent(this.token)}`
      : this.url;

    this.ws = new WebSocket(endpoint);

    this.ws.onopen = () => {
      this.attempt = 0;
      this.emit("connected", undefined as never);
    };

    this.ws.onmessage = (ev: MessageEvent) => {
      try {
        const msg: WsMessage = JSON.parse(String(ev.data));
        if (msg.event) {
          this.emit(msg.event as BerkideEvent, msg.data as never);
        }
      } catch {
        // Non-JSON message — ignore
        // JSON olmayan mesaj — yoksay
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.emit("disconnected", undefined as never);

      // Auto-reconnect if enabled and not manually closed
      // Etkinse ve manuel kapatılmadıysa otomatik yeniden bağlan
      if (
        !this.closed &&
        this.reconnectEnabled &&
        this.attempt < this.maxAttempts
      ) {
        this.attempt++;
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };

    this.ws.onerror = () => {
      this.emit("error", new Error("WebSocket error") as never);
    };
  }

  /**
   * Close WebSocket connection (disables auto-reconnect).
   * WebSocket bağlantısını kapat (otomatik yeniden bağlanmayı devre dışı bırakır).
   */
  disconnect(): void {
    this.closed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send a command over WebSocket.
   * WebSocket üzerinden komut gönder.
   *
   * @param data - Command request / Komut isteği
   */
  send(data: CommandRequest): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Request full state sync from server.
   * Sunucudan tam durum senkronizasyonu iste.
   */
  requestSync(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: "requestSync" }));
    }
  }

  /**
   * Subscribe to an event.
   * Bir olaya abone ol.
   *
   * @param event    - Event name / Olay adı
   * @param listener - Callback function / Geri çağırma fonksiyonu
   */
  on<E extends BerkideEvent>(
    event: E,
    listener: Listener<BerkideEventMap[E]>
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as Listener<unknown>);
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
    listener: Listener<BerkideEventMap[E]>
  ): void {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
  }

  /** Whether WebSocket is currently connected / WebSocket şu an bağlı mı */
  get connected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Emit an event to all listeners.
   * Tüm dinleyicilere olay yayınla.
   */
  private emit<E extends BerkideEvent>(
    event: E,
    data: BerkideEventMap[E]
  ): void {
    const set = this.listeners.get(event);
    if (set) {
      for (const fn of set) {
        fn(data);
      }
    }
  }
}
