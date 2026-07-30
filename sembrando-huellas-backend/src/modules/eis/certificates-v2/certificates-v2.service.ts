import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CertificatesService } from '../../ai/certificates/certificates.service';

@Injectable()
export class CertificatesV2Service {
  private readonly logger = new Logger(CertificatesV2Service.name);

  constructor(
    private prisma: PrismaService,
    private certificatesService: CertificatesService,
  ) {}

  async generate(dto: {
    recipientName: string;
    recipientEmail?: string;
    certificateType: string;
    programName: string;
    hours?: string;
    eventDate?: string;
  }) {
    const result = await this.certificatesService.generateCertificate(dto);

    const issued = await (this.prisma as any).issuedCertificate.create({
      data: {
        recipientName: dto.recipientName,
        recipientEmail: dto.recipientEmail,
        certificateType: dto.certificateType,
        programName: dto.programName,
        hours: dto.hours,
        eventDate: dto.eventDate || new Date().toISOString(),
        verificationCode: result.verificationCode,
        verificationUrl: result.verificationUrl,
        qrDataUrl: result.qrDataUrl,
        metadata: { generatedBy: 'eis-v2' },
      },
    });

    return { ...result, id: issued.id };
  }

  async verify(code: string) {
    const certificate = await (this.prisma as any).issuedCertificate.findUnique({
      where: { verificationCode: code },
    });

    if (!certificate) {
      return { valid: false, message: 'Certificado no encontrado. Verifique el código e intente nuevamente.' };
    }

    if (certificate.revokedAt) {
      return { valid: false, message: 'Este certificado ha sido revocado.', revokedAt: certificate.revokedAt };
    }

    return {
      valid: true,
      certificate: {
        recipientName: certificate.recipientName,
        certificateType: certificate.certificateType,
        programName: certificate.programName,
        hours: certificate.hours,
        issuedAt: certificate.issuedAt,
        verificationCode: certificate.verificationCode,
      },
      message: `Certificado verificado: ${certificate.recipientName} - ${certificate.programName}`,
    };
  }

  async revoke(code: string) {
    const certificate = await (this.prisma as any).issuedCertificate.findUnique({
      where: { verificationCode: code },
    });

    if (!certificate) throw new Error('Certificado no encontrado');
    if (certificate.revokedAt) throw new Error('El certificado ya fue revocado');

    await (this.prisma as any).issuedCertificate.update({
      where: { id: certificate.id },
      data: { revokedAt: new Date() },
    });

    return { revoked: true, code };
  }

  async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      (this.prisma as any).issuedCertificate.findMany({
        skip,
        take: limit,
        orderBy: { issuedAt: 'desc' },
      }),
      (this.prisma as any).issuedCertificate.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getStats() {
    const [total, active, revoked] = await Promise.all([
      (this.prisma as any).issuedCertificate.count(),
      (this.prisma as any).issuedCertificate.count({ where: { revokedAt: null } }),
      (this.prisma as any).issuedCertificate.count({ where: { revokedAt: { not: null } } }),
    ]);
    return { total, active, revoked };
  }
}
