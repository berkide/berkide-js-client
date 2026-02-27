// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { HttpTransport } from "../http.js";
import type { ApiResponse, EditorState } from "../types.js";

/**
 * Full editor state snapshot (cursor, buffer, mode, tabs).
 * Tam editör durum görüntüsü (imleç, buffer, mod, sekmeler).
 */
export class StateAPI {
  constructor(private http: HttpTransport) {}

  /**
   * Get full editor state in a single request.
   * Tek istekle tam editör durumunu al.
   */
  get(): Promise<ApiResponse<EditorState>> {
    return this.http.get<EditorState>("/api/state");
  }
}
