// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

// ── Client configuration ──────────────────────────────────────────
// ── İstemci yapılandırması ─────────────────────────────────────────

/**
 * Configuration options for BerkideClient.
 * BerkideClient yapılandırma seçenekleri.
 */
export interface ClientOptions {
  /**
   * HTTP base URL (e.g. "http://127.0.0.1:1881").
   * HTTP temel adresi (ör. "http://127.0.0.1:1881").
   */
  url: string;

  /**
   * WebSocket URL — derived from `url` if omitted.
   * WebSocket adresi — verilmezse `url`'den türetilir.
   */
  wsUrl?: string;

  /**
   * Bearer token for authentication.
   * Kimlik doğrulama için bearer token.
   */
  token?: string;

  /**
   * Auto-reconnect on WebSocket disconnect (default: true).
   * WebSocket koptuğunda otomatik yeniden bağlan (varsayılan: true).
   */
  reconnect?: boolean;

  /**
   * Reconnect interval in milliseconds (default: 2000).
   * Yeniden bağlanma aralığı, milisaniye (varsayılan: 2000).
   */
  reconnectInterval?: number;

  /**
   * Maximum reconnect attempts (default: Infinity).
   * Maksimum yeniden bağlanma denemesi (varsayılan: sınırsız).
   */
  maxReconnectAttempts?: number;
}

// ── API response wrapper ──────────────────────────────────────────
// ── API yanıt sarmalayıcısı ───────────────────────────────────────

/**
 * Standard API response from BerkIDE server.
 * BerkIDE sunucusundan dönen standart API yanıtı.
 *
 * @typeParam T - Response data type / Yanıt veri tipi
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request succeeded / İstek başarılı mı */
  ok: boolean;
  /** Response payload / Yanıt verisi */
  data: T;
  /** Optional metadata (e.g. total count) / Opsiyonel meta veri (ör. toplam sayı) */
  meta: Record<string, unknown> | null;
  /** Error key if failed / Hata durumunda hata anahtarı */
  error: string | null;
  /** Human-readable message / Okunabilir mesaj */
  message: string | null;
}

// ── Editor state ──────────────────────────────────────────────────
// ── Editör durumu ─────────────────────────────────────────────────

/**
 * Cursor position in a buffer.
 * Buffer içindeki imleç konumu.
 */
export interface CursorPosition {
  /** Zero-based line number / Sıfır tabanlı satır numarası */
  line: number;
  /** Zero-based column number / Sıfır tabanlı sütun numarası */
  col: number;
}

/**
 * Active buffer content and metadata.
 * Aktif buffer içeriği ve meta verisi.
 */
export interface BufferData {
  /** All lines in the buffer / Buffer'daki tüm satırlar */
  lines: string[];
  /** Total line count / Toplam satır sayısı */
  lineCount: number;
  /** Absolute file path (empty if unsaved) / Mutlak dosya yolu (kaydedilmemişse boş) */
  filePath: string;
  /** Whether buffer has unsaved changes / Buffer'da kaydedilmemiş değişiklik var mı */
  modified: boolean;
}

/**
 * Summary info for a buffer in the tab bar.
 * Sekme çubuğundaki buffer özet bilgisi.
 */
export interface BufferInfo {
  /** Buffer index / Buffer indeksi */
  index: number;
  /** Display title (filename or "untitled") / Görünen başlık (dosya adı veya "isimsiz") */
  title: string;
  /** Whether this buffer is currently active / Bu buffer şu an aktif mi */
  active: boolean;
}

/**
 * Full editor state snapshot.
 * Editörün tam durum görüntüsü.
 */
export interface EditorState {
  /** Current cursor position / Mevcut imleç konumu */
  cursor: CursorPosition;
  /** Active buffer data / Aktif buffer verisi */
  buffer: BufferData;
  /** Current editing mode (normal, insert, visual...) / Mevcut düzenleme modu */
  mode: string;
  /** Index of the active buffer / Aktif buffer'ın indeksi */
  activeIndex: number;
  /** All open buffers / Tüm açık buffer'lar */
  buffers: BufferInfo[];
}

/**
 * Single line from a buffer.
 * Buffer'dan tek bir satır.
 */
export interface LineData {
  /** Line number / Satır numarası */
  line: number;
  /** Line content / Satır içeriği */
  content: string;
}

// ── Server info ───────────────────────────────────────────────────
// ── Sunucu bilgisi ────────────────────────────────────────────────

/**
 * BerkIDE server status and configuration.
 * BerkIDE sunucu durumu ve yapılandırması.
 */
export interface ServerInfo {
  /** Server name / Sunucu adı */
  name: string;
  /** Server version / Sunucu sürümü */
  version: string;
  /** Running status / Çalışma durumu */
  status: string;
  /** HTTP server info / HTTP sunucu bilgisi */
  http: { bind: string; port: number };
  /** WebSocket server info / WebSocket sunucu bilgisi */
  ws: { port: number };
  /** Whether TLS is enabled / TLS aktif mi */
  tls: boolean;
  /** Whether authentication is required / Kimlik doğrulama gerekli mi */
  auth: boolean;
  /** Total registered endpoint count / Toplam kayıtlı endpoint sayısı */
  endpoints: number;
}

/**
 * HTTP endpoint metadata.
 * HTTP endpoint meta verisi.
 */
export interface EndpointInfo {
  /** HTTP method (GET, POST...) / HTTP metodu */
  method: string;
  /** URL path / URL yolu */
  path: string;
  /** Endpoint description / Endpoint açıklaması */
  description: string;
  /** Whether authentication is required / Kimlik doğrulama gerekli mi */
  auth: boolean;
}

// ── Command ───────────────────────────────────────────────────────
// ── Komut ─────────────────────────────────────────────────────────

/**
 * Command execution request.
 * Komut çalıştırma isteği.
 */
export interface CommandRequest {
  /** Command name (e.g. "file.save") / Komut adı (ör. "file.save") */
  cmd: string;
  /** Optional arguments / Opsiyonel argümanlar */
  args?: Record<string, unknown>;
}

// ── Help ──────────────────────────────────────────────────────────
// ── Yardım ────────────────────────────────────────────────────────

/**
 * Help topic summary.
 * Yardım konusu özeti.
 */
export interface HelpEntry {
  /** Topic identifier / Konu tanımlayıcısı */
  id: string;
  /** Topic title / Konu başlığı */
  title: string;
  /** Search tags / Arama etiketleri */
  tags: string[];
}

/**
 * Full help article with content.
 * İçerikli tam yardım makalesi.
 */
export interface HelpArticle extends HelpEntry {
  /** Article body (markdown) / Makale içeriği (markdown) */
  content: string;
}

// ── WebSocket events ──────────────────────────────────────────────
// ── WebSocket olayları ────────────────────────────────────────────

/**
 * Raw WebSocket message from server.
 * Sunucudan gelen ham WebSocket mesajı.
 */
export interface WsMessage {
  /** Event name / Olay adı */
  event: string;
  /** Event payload / Olay verisi */
  data: unknown;
}

/**
 * Fired when buffer content changes.
 * Buffer içeriği değiştiğinde tetiklenir.
 */
export interface BufferChangedEvent {
  /** Path of the changed file / Değişen dosyanın yolu */
  filePath: string;
  /** Cursor position after change / Değişiklik sonrası imleç konumu */
  cursor: CursorPosition;
}

/**
 * Fired when cursor moves.
 * İmleç hareket ettiğinde tetiklenir.
 */
export interface CursorMovedEvent {
  /** New line number / Yeni satır numarası */
  line: number;
  /** New column number / Yeni sütun numarası */
  col: number;
}

/**
 * Fired when active tab changes.
 * Aktif sekme değiştiğinde tetiklenir.
 */
export interface TabChangedEvent {
  /** Index of the new active buffer / Yeni aktif buffer'ın indeksi */
  activeIndex: number;
}

/**
 * Event name → payload type mapping.
 * Olay adı → veri tipi eşleştirmesi.
 */
export type BerkideEventMap = {
  /** Full state sync (on connect or manual request) / Tam durum senkronizasyonu */
  fullSync: EditorState;
  /** Buffer content changed / Buffer içeriği değişti */
  bufferChanged: BufferChangedEvent;
  /** Cursor position changed / İmleç konumu değişti */
  cursorMoved: CursorMovedEvent;
  /** Active tab changed / Aktif sekme değişti */
  tabChanged: TabChangedEvent;
  /** WebSocket connected / WebSocket bağlandı */
  connected: void;
  /** WebSocket disconnected / WebSocket bağlantısı koptu */
  disconnected: void;
  /** WebSocket error / WebSocket hatası */
  error: Error;
};

/** All possible event names / Tüm olası olay adları */
export type BerkideEvent = keyof BerkideEventMap;

// ── Buffer edit actions ───────────────────────────────────────────
// ── Buffer düzenleme işlemleri ─────────────────────────────────────

/** Edit operation type / Düzenleme işlem tipi */
export type EditAction = "insert" | "delete" | "insertLine" | "deleteLine";

/**
 * Buffer edit request.
 * Buffer düzenleme isteği.
 */
export interface EditRequest {
  /** Edit action type / Düzenleme işlem tipi */
  action: EditAction;
  /** Text to insert (for insert actions) / Eklenecek metin (ekleme işlemleri için) */
  text?: string;
  /** Target line number / Hedef satır numarası */
  line?: number;
  /** Target column number / Hedef sütun numarası */
  col?: number;
}
