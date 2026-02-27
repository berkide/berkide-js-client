// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { HttpTransport } from "../http.js";
import type { ApiResponse, HelpEntry, HelpArticle } from "../types.js";

/**
 * Offline help system — browse and search documentation.
 * Çevrimdışı yardım sistemi — belgelere göz at ve ara.
 */
export class HelpAPI {
  constructor(private http: HttpTransport) {}

  /**
   * List all help topics.
   * Tüm yardım konularını listele.
   */
  list(): Promise<ApiResponse<HelpEntry[]>> {
    return this.http.get<HelpEntry[]>("/api/help");
  }

  /**
   * Search help topics by keyword.
   * Anahtar kelimeyle yardım konularını ara.
   *
   * @param query - Search query / Arama sorgusu
   */
  search(query: string): Promise<ApiResponse<HelpEntry[]>> {
    return this.http.get<HelpEntry[]>(
      `/api/help/search?q=${encodeURIComponent(query)}`
    );
  }

  /**
   * Get a full help article by topic ID.
   * Konu ID'sine göre tam yardım makalesini al.
   *
   * @param id - Topic identifier / Konu tanımlayıcısı
   */
  topic(id: string): Promise<ApiResponse<HelpArticle>> {
    return this.http.get<HelpArticle>(`/api/help/${encodeURIComponent(id)}`);
  }
}
