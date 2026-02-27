// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { ApiResponse } from "./types.js";

/**
 * Low-level HTTP transport for BerkIDE REST API.
 * BerkIDE REST API'si için düşük seviye HTTP aktarım katmanı.
 *
 * Wraps native `fetch` — works in both browser and Node.js 18+.
 * Native `fetch` kullanır — hem tarayıcıda hem Node.js 18+'da çalışır.
 */
export class HttpTransport {
  private baseUrl: string;
  private token: string | undefined;

  /**
   * @param baseUrl - HTTP base URL (e.g. "http://127.0.0.1:1881")
   *                  HTTP temel adresi (ör. "http://127.0.0.1:1881")
   * @param token   - Bearer token for authentication
   *                  Kimlik doğrulama için bearer token
   */
  constructor(baseUrl: string, token?: string) {
    // Strip trailing slash / Sondaki eğik çizgiyi temizle
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = token;
  }

  /**
   * Build request headers with optional auth.
   * Opsiyonel auth ile istek başlıklarını oluştur.
   */
  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      h["Authorization"] = `Bearer ${this.token}`;
    }
    return h;
  }

  /**
   * Send a GET request.
   * GET isteği gönder.
   *
   * @typeParam T - Expected response data type / Beklenen yanıt veri tipi
   * @param path  - API path (e.g. "/api/buffer") / API yolu (ör. "/api/buffer")
   * @returns Parsed API response / Ayrıştırılmış API yanıtı
   */
  async get<T = unknown>(path: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: this.headers(),
    });
    return res.json() as Promise<ApiResponse<T>>;
  }

  /**
   * Send a POST request with optional JSON body.
   * Opsiyonel JSON gövdesiyle POST isteği gönder.
   *
   * @typeParam T - Expected response data type / Beklenen yanıt veri tipi
   * @param path  - API path / API yolu
   * @param body  - Request body (will be JSON-serialized) / İstek gövdesi (JSON'a çevrilir)
   * @returns Parsed API response / Ayrıştırılmış API yanıtı
   */
  async post<T = unknown>(
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.headers(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return res.json() as Promise<ApiResponse<T>>;
  }

  /**
   * Health check — returns true if server responds with "pong".
   * Sağlık kontrolü — sunucu "pong" dönerse true döner.
   */
  async ping(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/ping`, { method: "GET" });
      const text = await res.text();
      return text === "pong";
    } catch {
      return false;
    }
  }
}
