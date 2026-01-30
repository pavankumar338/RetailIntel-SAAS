import nodemailer from 'nodemailer';

export async function sendLowStockEmail(toEmail: string, productName: string, currentStock: number) {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.warn('SMTP credentials missing. Skipping low stock email.');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"RetailIntel" <${process.env.SMTP_EMAIL}>`,
        to: toEmail,
        subject: `⚠️ Low Stock Alert: ${productName}`,
        text: `Your product "${productName}" is running low on stock. Current quantity: ${currentStock}.\nPlease restock soon.`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #fafafa;">
        <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #ef4444; margin-top: 0;">Low Stock Warning</h2>
            <p style="color: #374151; font-size: 16px;">The following product has dropped below the threshold:</p>
            
            <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold; color: #991b1b; font-size: 18px;">${productName}</p>
                <p style="margin: 5px 0 0 0; color: #b91c1c;">Remaining Stock: <strong>${currentStock}</strong></p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">Please arrange for restocking to avoid running out of inventory.</p>
            
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">Retail Intelligence System</p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Low stock email sent to ${toEmail} for ${productName}`);
    } catch (error) {
        console.error('Error sending low stock email:', error);
    }
}
