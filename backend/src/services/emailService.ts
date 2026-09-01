import nodemailer from 'nodemailer';
import { logger } from '../config/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure based on environment
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(to: string, firstName: string, token: string) {
    const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;

    return this.sendMail({
      to,
      subject: 'Verify your email — Resto DZ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ea580c;">🇩🇿 Resto DZ</h1>
          <h2>Welcome, ${firstName}!</h2>
          <p>Please verify your email address to complete your registration.</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #666;">This link will expire in 24 hours.</p>
          <hr style="border: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
        </div>
      `,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, firstName: string, token: string) {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/reset-password?token=${token}`;

    return this.sendMail({
      to,
      subject: 'Reset your password — Resto DZ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ea580c;">🇩🇿 Resto DZ</h1>
          <h2>Password Reset Request</h2>
          <p>Hello ${firstName},</p>
          <p>We received a request to reset your password.</p>
          <a href="${resetUrl}" 
             style="display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666;">This link will expire in 1 hour.</p>
          <hr style="border: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  }

  /**
   * Generic send mail wrapper
   */
  private async sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Resto DZ" <${process.env.SMTP_FROM || 'no-reply@restodz.dz'}>`,
        to,
        subject,
        html,
      });
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error(`Failed to send email to ${to}: ${error}`);
      // Don't throw — email failure shouldn't break registration
            return { success: false, error: (error as Error).message };
    }
  }
}

export const emailService = new EmailService();
export default emailService;
