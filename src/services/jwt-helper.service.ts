import { Injectable } from '@angular/core';
import { JwtPayload } from '../models/jwt';

const SECRET = 'techvault-jwt-secret-key-2026';
const TOKEN_EXPIRY_HOURS = 1;

@Injectable({ providedIn: 'root' })
export class JwtHelperService {
  private encoder = new TextEncoder();

  private async getKey(): Promise<CryptoKey> {
    return crypto.subtle.importKey(
      'raw',
      this.encoder.encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify'],
    );
  }

  private base64UrlEncode(data: Uint8Array): string {
    let binary = '';
    for (const byte of data) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private base64UrlDecode(str: string): Uint8Array {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  async signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    const key = await this.getKey();
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + TOKEN_EXPIRY_HOURS * 3600,
    };

    const header = this.base64UrlEncode(
      this.encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    );
    const body = this.base64UrlEncode(this.encoder.encode(JSON.stringify(fullPayload)));
    const data = `${header}.${body}`;

    const signature = await crypto.subtle.sign('HMAC', key, this.encoder.encode(data));
    const sigBase64 = this.base64UrlEncode(new Uint8Array(signature));

    return `${data}.${sigBase64}`;
  }

  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [header, body, sigBase64] = parts;
      const key = await this.getKey();
      const sigBytes = this.base64UrlDecode(sigBase64);
      const valid = await crypto.subtle.verify(
        'HMAC',
        key,
        sigBytes.buffer as ArrayBuffer,
        this.encoder.encode(`${header}.${body}`),
      );

      if (!valid) return null;

      const payload: JwtPayload = JSON.parse(
        new TextDecoder().decode(this.base64UrlDecode(body)),
      );

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const body = token.split('.')[1];
      return JSON.parse(new TextDecoder().decode(this.base64UrlDecode(body))) as JwtPayload;
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    return payload.exp < Math.floor(Date.now() / 1000);
  }
}
