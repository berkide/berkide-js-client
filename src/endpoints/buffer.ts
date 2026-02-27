// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { HttpTransport } from "../http.js";
import type {
  ApiResponse,
  BufferData,
  LineData,
  EditRequest,
} from "../types.js";

/**
 * Active buffer operations (content, lines, edit, open, save, close).
 * Aktif buffer işlemleri (içerik, satırlar, düzenleme, açma, kaydetme, kapatma).
 */
export class BufferAPI {
  constructor(private http: HttpTransport) {}

  /**
   * Get active buffer content and metadata.
   * Aktif buffer içeriğini ve meta verisini al.
   */
  get(): Promise<ApiResponse<BufferData>> {
    return this.http.get<BufferData>("/api/buffer");
  }

  /**
   * Get a single line by number.
   * Numarasına göre tek bir satır al.
   *
   * @param n - Zero-based line number / Sıfır tabanlı satır numarası
   */
  line(n: number): Promise<ApiResponse<LineData>> {
    return this.http.get<LineData>(`/api/buffer/line/${n}`);
  }

  /**
   * Perform an edit operation on the active buffer.
   * Aktif buffer üzerinde düzenleme işlemi yap.
   *
   * @param req - Edit request (action, text, line, col)
   *              Düzenleme isteği (işlem, metin, satır, sütun)
   */
  edit(req: EditRequest): Promise<ApiResponse> {
    return this.http.post("/api/buffer/edit", req);
  }

  /**
   * Open a file into a new buffer.
   * Bir dosyayı yeni buffer'a aç.
   *
   * @param path - Absolute file path / Mutlak dosya yolu
   */
  open(path: string): Promise<ApiResponse> {
    return this.http.post("/api/buffer/open", { path });
  }

  /**
   * Save the active buffer to disk.
   * Aktif buffer'ı diske kaydet.
   */
  save(): Promise<ApiResponse> {
    return this.http.post("/api/buffer/save");
  }

  /**
   * Close the active buffer.
   * Aktif buffer'ı kapat.
   */
  close(): Promise<ApiResponse> {
    return this.http.post("/api/buffer/close");
  }
}
