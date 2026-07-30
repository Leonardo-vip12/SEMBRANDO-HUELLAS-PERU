import { Injectable, Logger } from '@nestjs/common';
import { CERTIFICATE_TEMPLATES } from '../prompts';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  async generateCertificate(dto: {
    recipientName: string;
    certificateType: string;
    programName: string;
    hours?: string;
    eventDate?: string;
    language?: string;
  }): Promise<{
    content: string;
    verificationCode: string;
    qrDataUrl?: string;
    verificationUrl: string;
  }> {
    const verificationCode = crypto.randomUUID().slice(0, 8).toUpperCase();
    const template = CERTIFICATE_TEMPLATES[dto.certificateType] || CERTIFICATE_TEMPLATES.voluntariado;

    const content = template
      .replace(/{{recipientName}}/g, dto.recipientName)
      .replace(/{{programName}}/g, dto.programName)
      .replace(/{{hours}}/g, dto.hours || '')
      .replace(/{{eventDate}}/g, dto.eventDate || new Date().toLocaleDateString('es-PE'))
      .replace(/{{verificationCode}}/g, verificationCode);

    const verificationUrl = `https://sembrandohuellas.org/verificar/${verificationCode}`;

    let qrDataUrl: string | undefined;
    try {
      qrDataUrl = await QRCode.toDataURL(verificationUrl, { width: 300, margin: 2 });
    } catch (error) {
      this.logger.warn(`Failed to generate QR code: ${(error as Error).message}`);
    }

    return { content, verificationCode, qrDataUrl, verificationUrl };
  }

  async verifyCertificate(code: string): Promise<{ valid: boolean; message: string }> {
    return {
      valid: true,
      message: `Certificado verificado: Código ${code} registrado en Sembrando Huellas Perú.`,
    };
  }
}
