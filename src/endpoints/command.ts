// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { HttpTransport } from "../http.js";
import type { ApiResponse } from "../types.js";

/**
 * Command dispatch — execute any of the 267 registered commands.
 * Komut gönderimi — kayıtlı 267 komuttan herhangi birini çalıştır.
 *
 * This is the primary way to interact with BerkIDE.
 * BerkIDE ile etkileşimin ana yolu budur.
 *
 * @example
 * ```typescript
 * await client.command.exec("file.save");
 * await client.command.exec("cursor.goto", { line: 10, col: 0 });
 * await client.command.exec("edit.undo");
 * ```
 */
export class CommandAPI {
  constructor(private http: HttpTransport) {}

  /**
   * Execute a command by name.
   * Adına göre komut çalıştır.
   *
   * @param cmd  - Command name (e.g. "file.save", "cursor.up")
   *               Komut adı (ör. "file.save", "cursor.up")
   * @param args - Optional arguments / Opsiyonel argümanlar
   */
  exec(cmd: string, args?: Record<string, unknown>): Promise<ApiResponse> {
    return this.http.post("/api/command", { cmd, args });
  }

  /**
   * List all registered commands.
   * Tüm kayıtlı komutları listele.
   */
  list(): Promise<ApiResponse> {
    return this.http.get("/api/commands");
  }
}
