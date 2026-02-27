// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { HttpTransport } from "../http.js";
import type { ApiResponse, CursorPosition } from "../types.js";

/**
 * Cursor position queries.
 * İmleç konum sorguları.
 */
export class CursorAPI {
  constructor(private http: HttpTransport) {}

  /**
   * Get current cursor position (line, col).
   * Mevcut imleç konumunu al (satır, sütun).
   */
  position(): Promise<ApiResponse<CursorPosition>> {
    return this.http.get<CursorPosition>("/api/cursor");
  }
}
