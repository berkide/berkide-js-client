// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { HttpTransport } from "../http.js";
import type { ApiResponse, BufferInfo } from "../types.js";

/**
 * Multi-buffer management (list open buffers, switch tabs).
 * Çoklu buffer yönetimi (açık buffer'ları listele, sekme değiştir).
 */
export class BuffersAPI {
  constructor(private http: HttpTransport) {}

  /**
   * List all open buffers.
   * Tüm açık buffer'ları listele.
   */
  list(): Promise<ApiResponse<BufferInfo[]>> {
    return this.http.get<BufferInfo[]>("/api/buffers");
  }

  /**
   * Switch to a buffer by index.
   * İndeksine göre buffer'a geç.
   *
   * @param index - Buffer index / Buffer indeksi
   */
  switchTo(index: number): Promise<ApiResponse> {
    return this.http.post("/api/buffers/switch", { index });
  }
}
