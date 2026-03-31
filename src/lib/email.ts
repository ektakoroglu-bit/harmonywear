import nodemailer from 'nodemailer';
import { Order } from '@/types';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

function getEstimatedDelivery(): string {
  const date = new Date();
  // Add 3-5 business days
  let businessDays = 0;
  while (businessDays < 4) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) businessDays++;
  }
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function createTransporter() {
  const host = process.env.ZOHO_SMTP_HOST;
  const port = process.env.ZOHO_SMTP_PORT;
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;

  console.log('[EMAIL] ZOHO_SMTP_HOST:', host ?? 'NOT SET');
  console.log('[EMAIL] ZOHO_SMTP_PORT:', port ?? 'NOT SET');
  console.log('[EMAIL] ZOHO_SMTP_USER:', user ?? 'NOT SET');
  console.log('[EMAIL] ZOHO_SMTP_PASS:', pass ? '***SET***' : 'NOT SET');

  if (!host || !user || !pass) {
    console.log('[EMAIL] Zoho SMTP env vars not set — email not sent');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 465,
    secure: (port ? parseInt(port, 10) : 465) === 465,
    auth: { user, pass },
  });
}

function buildCustomerEmailHtml(order: Order): string {
  const estimatedDelivery = getEstimatedDelivery();
  const addr = order.shippingAddress;
  const addressLine = [
    `${addr.firstName} ${addr.lastName}`,
    addr.address,
    addr.district ? `${addr.district}, ${addr.city}` : addr.city,
    addr.zipCode,
    addr.country,
  ].filter(Boolean).join('<br>');

  const itemRows = order.items.map(item => {
    const price = (item.product.salePrice ?? item.product.price) * item.quantity;
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0ece9;color:#2D2D2D;">
          ${item.product.name.tr}
          <span style="color:#888;font-size:12px;display:block;margin-top:2px;">
            Beden: ${item.size} · Renk: ${item.color.label.tr} · Adet: ${item.quantity}
          </span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0ece9;text-align:right;color:#2D2D2D;white-space:nowrap;">
          ${formatPrice(price)}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Sipariş Onayı — HARMONY</title>
</head>
<body style="margin:0;padding:0;background:#FAF7F5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#2D2D2D;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;color:#D4A5A5;font-size:28px;letter-spacing:6px;font-weight:300;">HARMONY</h1>
            <p style="margin:8px 0 0;color:#FAF7F5;font-size:12px;letter-spacing:2px;opacity:0.8;">SHAPEWEAR & BODYSUIT</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;">

            <!-- Greeting -->
            <h2 style="margin:0 0 8px;color:#2D2D2D;font-size:22px;">Siparişiniz alındı! 🎉</h2>
            <p style="margin:0 0 24px;color:#666;line-height:1.6;">
              Merhaba ${order.customer.firstName},<br>
              Siparişiniz başarıyla oluşturuldu. Aşağıda sipariş detaylarınızı bulabilirsiniz.
            </p>

            <!-- Order Number -->
            <div style="background:#FAF7F5;border-left:4px solid #D4A5A5;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:32px;">
              <p style="margin:0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Sipariş Numarası</p>
              <p style="margin:4px 0 0;color:#2D2D2D;font-size:18px;font-weight:bold;letter-spacing:1px;">${order.id}</p>
            </div>

            <!-- Items -->
            <h3 style="margin:0 0 16px;color:#2D2D2D;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Sipariş İçeriği</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemRows}
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
              <tr>
                <td style="padding:6px 0;color:#666;font-size:14px;">Ara Toplam</td>
                <td style="padding:6px 0;text-align:right;color:#2D2D2D;font-size:14px;">${formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#666;font-size:14px;">Kargo</td>
                <td style="padding:6px 0;text-align:right;color:#2D2D2D;font-size:14px;">${order.shipping === 0 ? 'Ücretsiz' : formatPrice(order.shipping)}</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td style="padding:6px 0;color:#16a34a;font-size:14px;">İndirim${order.discountCode ? ` (${order.discountCode})` : ''}</td>
                <td style="padding:6px 0;text-align:right;color:#16a34a;font-size:14px;">-${formatPrice(order.discount)}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="2" style="padding-top:12px;">
                  <div style="border-top:2px solid #2D2D2D;margin-bottom:8px;"></div>
                </td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#2D2D2D;font-size:18px;font-weight:bold;">Toplam</td>
                <td style="padding:4px 0;text-align:right;color:#2D2D2D;font-size:18px;font-weight:bold;">${formatPrice(order.total)}</td>
              </tr>
            </table>

            <!-- Delivery & Address -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
              <tr>
                <td width="50%" style="vertical-align:top;padding-right:16px;">
                  <h3 style="margin:0 0 8px;color:#2D2D2D;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Tahmini Teslimat</h3>
                  <p style="margin:0;color:#666;font-size:14px;line-height:1.6;">${estimatedDelivery}</p>
                  <p style="margin:4px 0 0;color:#888;font-size:12px;">3–5 iş günü içinde</p>
                </td>
                <td width="50%" style="vertical-align:top;">
                  <h3 style="margin:0 0 8px;color:#2D2D2D;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Teslimat Adresi</h3>
                  <p style="margin:0;color:#666;font-size:14px;line-height:1.8;">${addressLine}</p>
                </td>
              </tr>
            </table>

            <!-- Footer Message -->
            <div style="margin-top:40px;padding-top:24px;border-top:1px solid #f0ece9;text-align:center;">
              <p style="margin:0;color:#888;font-size:13px;line-height:1.8;">
                Siparişinizle ilgili sorularınız için<br>
                <a href="mailto:${process.env.ZOHO_SMTP_USER || 'noreply@harmonywear.com.tr'}" style="color:#D4A5A5;text-decoration:none;">${process.env.ZOHO_SMTP_USER || 'noreply@harmonywear.com.tr'}</a> adresine yazabilirsiniz.
              </p>
              <p style="margin:16px 0 0;color:#D4A5A5;font-size:12px;letter-spacing:3px;">HARMONY</p>
            </div>

          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function buildAdminEmailHtml(order: Order): string {
  const itemList = order.items.map(item => {
    const price = (item.product.salePrice ?? item.product.price) * item.quantity;
    return `• ${item.product.name.tr} — Beden: ${item.size}, Renk: ${item.color.label.tr}, Adet: ${item.quantity} — ${formatPrice(price)}`;
  }).join('\n');

  const addr = order.shippingAddress;
  const addressText = [
    `${addr.firstName} ${addr.lastName}`,
    addr.address,
    addr.district ? `${addr.district}, ${addr.city}` : addr.city,
    addr.zipCode,
    addr.country,
  ].filter(Boolean).join(', ');

  return `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><title>Yeni Sipariş — HARMONY Admin</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#2D2D2D;padding:24px 32px;">
            <h2 style="margin:0;color:#D4A5A5;font-size:16px;letter-spacing:2px;">HARMONY ADMIN</h2>
            <p style="margin:4px 0 0;color:#FAF7F5;font-size:20px;font-weight:bold;">Yeni Sipariş Geldi!</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Sipariş No</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;color:#2D2D2D;">${order.id}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Müşteri</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#2D2D2D;">${order.customer.firstName} ${order.customer.lastName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">E-posta</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#2D2D2D;">${order.customer.email}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Telefon</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#2D2D2D;">${order.customer.phone}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Toplam</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;font-size:18px;color:#2D2D2D;">${formatPrice(order.total)}</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">İndirim</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#16a34a;">${order.discountCode ? `${order.discountCode} — ` : ''}-${formatPrice(order.discount)}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Adres</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#2D2D2D;font-size:13px;">${addressText}</td>
              </tr>
            </table>

            <div style="margin-top:24px;background:#FAF7F5;border-radius:8px;padding:16px 20px;">
              <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Ürünler</p>
              <pre style="margin:0;color:#2D2D2D;font-size:13px;line-height:1.8;white-space:pre-wrap;font-family:Arial,sans-serif;">${itemList}</pre>
            </div>

            <div style="margin-top:24px;text-align:center;">
              <p style="margin:0;color:#888;font-size:12px;">
                Siparişi yönetmek için admin paneline gidin.
              </p>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function buildShippingTrackingEmailHtml(order: Order, trackingNumber: string, trackingUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Kargonuz Yola Çıktı — HARMONY</title>
</head>
<body style="margin:0;padding:0;background:#FAF7F5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#2D2D2D;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;color:#D4A5A5;font-size:28px;letter-spacing:6px;font-weight:300;">HARMONY</h1>
            <p style="margin:8px 0 0;color:#FAF7F5;font-size:12px;letter-spacing:2px;opacity:0.8;">SHAPEWEAR & BODYSUIT</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;">
            <h2 style="margin:0 0 8px;color:#2D2D2D;font-size:22px;">Kargonuz yola çıktı! 🚚</h2>
            <p style="margin:0 0 24px;color:#666;line-height:1.6;">
              Merhaba ${order.customer.firstName},<br>
              Siparişiniz kargoya verildi. Aşağıdaki bilgileri kullanarak takip edebilirsiniz.
            </p>
            <div style="background:#FAF7F5;border-left:4px solid #D4A5A5;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
              <p style="margin:0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Sipariş Numarası</p>
              <p style="margin:4px 0 0;color:#2D2D2D;font-size:16px;font-weight:bold;">${order.id}</p>
            </div>
            <div style="background:#FAF7F5;border-left:4px solid #D4A5A5;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:32px;">
              <p style="margin:0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Kargo Takip Numarası</p>
              <p style="margin:4px 0 0;color:#2D2D2D;font-size:16px;font-weight:bold;">${trackingNumber}</p>
            </div>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${trackingUrl}" style="display:inline-block;background:#2D2D2D;color:#FAF7F5;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;letter-spacing:1px;">Kargonu Takip Et</a>
            </div>
            <p style="margin:0;color:#888;font-size:13px;line-height:1.8;text-align:center;">
              Sorularınız için
              <a href="mailto:${process.env.ZOHO_SMTP_USER || 'noreply@harmonywear.com.tr'}" style="color:#D4A5A5;text-decoration:none;">${process.env.ZOHO_SMTP_USER || 'noreply@harmonywear.com.tr'}</a>
            </p>
            <p style="margin:16px 0 0;color:#D4A5A5;font-size:12px;letter-spacing:3px;text-align:center;">HARMONY</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function buildPasswordResetEmailHtml(resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Şifre Sıfırlama — HARMONY</title>
</head>
<body style="margin:0;padding:0;background:#FAF7F5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#2D2D2D;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;color:#D4A5A5;font-size:28px;letter-spacing:6px;font-weight:300;">HARMONY</h1>
            <p style="margin:8px 0 0;color:#FAF7F5;font-size:12px;letter-spacing:2px;opacity:0.8;">SHAPEWEAR & BODYSUIT</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;">
            <h2 style="margin:0 0 8px;color:#2D2D2D;font-size:22px;">Şifre Sıfırlama</h2>
            <p style="margin:0 0 24px;color:#666;line-height:1.6;">
              Hesabınız için şifre sıfırlama talebinde bulundunuz.<br>
              Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
            </p>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${resetLink}" style="display:inline-block;background:#2D2D2D;color:#FAF7F5;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;letter-spacing:1px;">Şifremi Sıfırla</a>
            </div>
            <p style="margin:0 0 16px;color:#888;font-size:13px;line-height:1.8;text-align:center;">
              Bu bağlantı 1 saat geçerlidir. Eğer bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
            </p>
            <p style="margin:0;color:#888;font-size:13px;line-height:1.8;text-align:center;">
              Sorularınız için
              <a href="mailto:${process.env.ZOHO_SMTP_USER || 'noreply@harmonywear.com.tr'}" style="color:#D4A5A5;text-decoration:none;">${process.env.ZOHO_SMTP_USER || 'noreply@harmonywear.com.tr'}</a>
            </p>
            <p style="margin:16px 0 0;color:#D4A5A5;font-size:12px;letter-spacing:3px;text-align:center;">HARMONY</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function buildStockNotificationEmailHtml(productName: string): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Ürün Tekrar Stokta — HARMONY</title>
</head>
<body style="margin:0;padding:0;background:#FAF7F5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#2D2D2D;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;color:#D4A5A5;font-size:28px;letter-spacing:6px;font-weight:300;">HARMONY</h1>
            <p style="margin:8px 0 0;color:#FAF7F5;font-size:12px;letter-spacing:2px;opacity:0.8;">SHAPEWEAR & BODYSUIT</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;">
            <h2 style="margin:0 0 8px;color:#2D2D2D;font-size:22px;">İyi haber! Ürün tekrar stokta 🎉</h2>
            <p style="margin:0 0 24px;color:#666;line-height:1.6;">
              Beklediğiniz ürün tekrar stoğa girdi. Hemen sipariş verin, kaçırmayın!
            </p>
            <div style="background:#FAF7F5;border-left:4px solid #D4A5A5;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:32px;">
              <p style="margin:0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Ürün</p>
              <p style="margin:4px 0 0;color:#2D2D2D;font-size:18px;font-weight:bold;">${productName}</p>
            </div>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://harmonywear.com.tr'}/products" style="display:inline-block;background:#2D2D2D;color:#FAF7F5;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;letter-spacing:1px;">Alışverişe Git</a>
            </div>
            <p style="margin:0;color:#888;font-size:13px;line-height:1.8;text-align:center;">
              Sorularınız için
              <a href="mailto:${process.env.ZOHO_SMTP_USER || 'noreply@harmonywear.com.tr'}" style="color:#D4A5A5;text-decoration:none;">${process.env.ZOHO_SMTP_USER || 'noreply@harmonywear.com.tr'}</a>
            </p>
            <p style="margin:16px 0 0;color:#D4A5A5;font-size:12px;letter-spacing:3px;text-align:center;">HARMONY</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) return;

  const from = `"HARMONY" <${process.env.ZOHO_SMTP_USER}>`;
  const subject = `Sipariş Onayı — ${order.id}`;

  try {
    await transporter.sendMail({
      from,
      to: order.customer.email,
      subject,
      html: buildCustomerEmailHtml(order),
    });
    console.log('[EMAIL] Order confirmation sent to:', order.customer.email);
  } catch (err) {
    console.error('[EMAIL] Failed to send order confirmation:', {
      to: order.customer.email,
      orderId: order.id,
      error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
    });
    throw err;
  }
}

export async function sendShippingTrackingEmail(
  order: Order,
  trackingNumber: string,
  trackingUrl: string
): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"HARMONY" <${process.env.ZOHO_SMTP_USER}>`,
      to: order.customer.email,
      subject: `Kargonuz Yola Çıktı — ${order.id}`,
      html: buildShippingTrackingEmailHtml(order, trackingNumber, trackingUrl),
    });
    console.log('[EMAIL] Shipping tracking sent to:', order.customer.email);
  } catch (err) {
    console.error('[EMAIL] Failed to send shipping tracking:', {
      to: order.customer.email,
      orderId: order.id,
      error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
    });
    throw err;
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"HARMONY" <${process.env.ZOHO_SMTP_USER}>`,
      to: email,
      subject: 'Şifre Sıfırlama — HARMONY',
      html: buildPasswordResetEmailHtml(resetLink),
    });
    console.log('[EMAIL] Password reset sent to:', email);
  } catch (err) {
    console.error('[EMAIL] Failed to send password reset:', {
      to: email,
      error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
    });
    throw err;
  }
}

export async function sendStockNotificationEmail(email: string, productName: string): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"HARMONY" <${process.env.ZOHO_SMTP_USER}>`,
      to: email,
      subject: `${productName} — Tekrar Stokta!`,
      html: buildStockNotificationEmailHtml(productName),
    });
    console.log('[EMAIL] Stock notification sent to:', email);
  } catch (err) {
    console.error('[EMAIL] Failed to send stock notification:', {
      to: email,
      productName,
      error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
    });
    throw err;
  }
}
