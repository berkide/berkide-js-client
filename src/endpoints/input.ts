// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { HttpTransport } from "../http.js";
import type { ApiResponse } from "../types.js";

/**
 * Keyboard input simulation — send key presses and characters to the editor.
 * Klavye girişi simülasyonu — editöre tuş basışları ve karakterler gönder.
 */
export class InputAPI {
  constructor(private http: HttpTransport) {}

  /**
   * Simulate a key press (triggers keybindings).
   * Tuş basışı simüle et (tuş atamalarını tetikler).
   *
   * @param key - Key name (e.g. "Enter", "Escape", "Ctrl+S", "a")
   *              Tuş adı (ör. "Enter", "Escape", "Ctrl+S", "a")
   */
  key(key: string): Promise<ApiResponse> {
    return this.http.post("/api/input/key", { key });
  }

  /**
   * Insert raw text at cursor position.
   * İmleç konumuna ham metin ekle.
   *
   * @param text - Character(s) to insert / Eklenecek karakter(ler)
   */
  char(text: string): Promise<ApiResponse> {
    return this.http.post("/api/input/char", { text });
  }
}
