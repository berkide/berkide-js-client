// BerkIDE — No impositions.
// Copyright (c) 2025 Berk Coşar <lookmainpoint@gmail.com>
// Licensed under the MIT License.
// See LICENSE file in the project root for full license text.

import type { HttpTransport } from "../http.js";
import type { ApiResponse, ServerInfo, EndpointInfo } from "../types.js";

/**
 * Server status and discovery API.
 * Sunucu durumu ve keşif API'si.
 */
export class ServerAPI {
  constructor(private http: HttpTransport) {}

  /**
   * Health check — returns true if server is alive.
   * Sağlık kontrolü — sunucu ayaktaysa true döner.
   */
  ping(): Promise<boolean> {
    return this.http.ping();
  }

  /**
   * Get server info (version, ports, TLS, auth status).
   * Sunucu bilgisini al (sürüm, portlar, TLS, auth durumu).
   */
  info(): Promise<ApiResponse<ServerInfo>> {
    return this.http.get<ServerInfo>("/api/server");
  }

  /**
   * List all registered HTTP endpoints.
   * Tüm kayıtlı HTTP endpoint'lerini listele.
   */
  endpoints(): Promise<ApiResponse<EndpointInfo[]>> {
    return this.http.get<EndpointInfo[]>("/api/endpoints");
  }
}
