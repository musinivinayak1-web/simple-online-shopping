const EMAIL_LOGS_STORAGE_KEY = 'zapkart_email_notifications_v1';
const ADMIN_EMAIL = 'orders@zapkart.in';

/**
 * Save sent email to local inspection log for real-time debugging & verification
 */
const logEmailDispatch = (emailRecord) => {
  try {
    const existing = JSON.parse(localStorage.getItem(EMAIL_LOGS_STORAGE_KEY) || '[]');
    const updated = [emailRecord, ...existing].slice(0, 50); // keep last 50 emails
    localStorage.setItem(EMAIL_LOGS_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom browser event so the in-app notification drawer updates in real-time
    window.dispatchEvent(new CustomEvent('zapkart_email_sent', { detail: emailRecord }));
  } catch (err) {
    console.error('Failed to log email dispatch', err);
  }
};

/**
 * Get all logged email notifications
 */
export const getEmailLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(EMAIL_LOGS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * Clear email notification logs
 */
export const clearEmailLogs = () => {
  localStorage.removeItem(EMAIL_LOGS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('zapkart_email_sent'));
};

/**
 * Generate Customer Order Confirmation HTML Email
 */
export const generateCustomerOrderEmailHTML = (order) => {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #1e293b; font-size: 14px;">${item.title}</strong><br/>
          <span style="color: #64748b; font-size: 12px;">Brand: ${item.brand} | Category: ${item.category}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #1e293b; font-weight: bold;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #047857; font-weight: bold;">
          ₹${(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/><title>Order Confirmed - ZapKart</title></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2874f0 0%, #1a56db 100%); padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Zap<span style="color: #facc15;">Kart</span></h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #dbeafe;">Order Confirmation & Invoice Receipt</p>
        </div>

        <!-- Order Hero Banner -->
        <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; background-color: #f0fdf4;">
          <div style="color: #166534; font-size: 18px; font-weight: bold; margin-bottom: 6px;">
            ✓ Thank you for your order, ${order.address?.name || 'Customer'}!
          </div>
          <p style="margin: 0; color: #15803d; font-size: 13px;">
            Your order <strong>#${order.orderId}</strong> has been received and is being prepared with high priority.
          </p>
        </div>

        <!-- Meta Summary -->
        <div style="padding: 20px 24px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <table style="width: 100%; font-size: 13px;">
            <tr>
              <td style="color: #64748b;">Order Date:</td>
              <td style="text-align: right; font-weight: 600; color: #1e293b;">${order.displayDate}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding-top: 6px;">Estimated Delivery:</td>
              <td style="text-align: right; font-weight: 600; color: #047857; padding-top: 6px;">${order.estimatedDelivery}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding-top: 6px;">Payment Method:</td>
              <td style="text-align: right; font-weight: 600; color: #2563eb; padding-top: 6px;">${order.paymentMethod}</td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <div style="padding: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">
            Shipment Items (${order.items?.length || 0})
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background-color: #f8fafc; color: #64748b; text-align: left;">
                <th style="padding: 8px 12px;">Item</th>
                <th style="padding: 8px 12px; text-align: center;">Qty</th>
                <th style="padding: 8px 12px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Price Breakdown -->
          <div style="margin-top: 20px; border-top: 2px dashed #cbd5e1; padding-top: 12px;">
            <table style="width: 100%; font-size: 13px;">
              <tr>
                <td style="color: #64748b; padding: 4px 0;">Items Total MRP:</td>
                <td style="text-align: right; color: #1e293b;">₹${order.pricing?.totalMRP?.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="color: #047857; padding: 4px 0;">Discount Savings:</td>
                <td style="text-align: right; color: #047857; font-weight: bold;">- ₹${order.pricing?.totalSavings?.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding: 4px 0;">Delivery Charges:</td>
                <td style="text-align: right; color: #1e293b;">${order.pricing?.deliveryFee === 0 ? 'FREE' : `₹${order.pricing?.deliveryFee}`}</td>
              </tr>
              <tr style="font-size: 16px; font-weight: bold; border-top: 1px solid #e2e8f0;">
                <td style="color: #0f172a; padding: 10px 0;">Total Paid:</td>
                <td style="text-align: right; color: #0f172a; padding: 10px 0;">₹${order.pricing?.totalPayable?.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Delivery Address -->
        <div style="padding: 20px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 13px; color: #334155;">
          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Shipping To:</strong>
          ${order.address?.name}<br/>
          ${order.address?.addressLine}, ${order.address?.city}, ${order.address?.state} - <strong>${order.address?.pincode}</strong><br/>
          Phone: ${order.address?.phone}
        </div>

        <!-- Footer -->
        <div style="padding: 20px 24px; background-color: #0f172a; color: #94a3b8; font-size: 12px; text-align: center;">
          <p style="margin: 0 0 6px 0;">Need help? Track your order or contact our 24x7 Customer Care on ZapKart.com</p>
          <p style="margin: 0; color: #64748b;">© 2026 ZapKart Internet Private Limited. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
  `;
};

/**
 * Generate Admin/Company Alert HTML Email
 */
export const generateAdminOrderAlertHTML = (order) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/><title>ADMIN ALERT: New Order Received - ZapKart</title></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 20px; color: #334155;">
      <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 2px solid #3b82f6;">
        
        <div style="background-color: #1e293b; padding: 18px 24px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; font-size: 18px; color: #f59e0b;">⚡ ZapKart Ops Central</h2>
            <span style="font-size: 12px; color: #94a3b8;">New Order Dispatch Required</span>
          </div>
        </div>

        <div style="padding: 24px;">
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; margin-bottom: 16px;">
            <strong style="color: #1e40af; font-size: 15px;">Order ID: ${order.orderId}</strong><br/>
            <span style="font-size: 13px; color: #3b82f6;">Amount: ₹${order.pricing?.totalPayable?.toLocaleString('en-IN')} | Payment: ${order.paymentMethod}</span>
          </div>

          <h4 style="margin: 16px 0 8px 0; color: #0f172a; text-transform: uppercase; font-size: 12px;">Customer & Destination Details:</h4>
          <p style="font-size: 13px; line-height: 1.5; color: #334155; margin: 0 0 16px 0;">
            <strong>Customer:</strong> ${order.address?.name} (${order.address?.phone})<br/>
            <strong>Address:</strong> ${order.address?.addressLine}, ${order.address?.city}, ${order.address?.state} - PIN: ${order.address?.pincode}<br/>
            <strong>Address Type:</strong> ${order.address?.type || 'HOME'}
          </p>

          <h4 style="margin: 16px 0 8px 0; color: #0f172a; text-transform: uppercase; font-size: 12px;">Ordered SKU Breakdown:</h4>
          <ul style="font-size: 13px; color: #334155; padding-left: 20px; margin: 0 0 16px 0;">
            ${(order.items || [])
              .map(
                (item) => `
              <li style="margin-bottom: 6px;">
                <strong>[${item.brand}]</strong> ${item.title} — <strong>Qty: ${item.quantity}</strong> (₹${item.discountedPrice * item.quantity})
              </li>
            `
              )
              .join('')}
          </ul>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 12px; color: #475569;">
            <strong>Fulfillment Directive:</strong> Initiate barcode scan and warehouse dispatch to ZapKart Express Courier within 4 hours to satisfy ${order.estimatedDelivery} SLA.
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b;">
          Sent to internal company mailbox: ${ADMIN_EMAIL}
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate Order Cancellation Email (Customer)
 */
export const generateCustomerCancellationEmailHTML = (order, reason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/><title>Order Cancelled - ZapKart</title></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #fee2e2;">
        
        <div style="background-color: #b91c1c; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px;">Zap<span style="color: #fde047;">Kart</span></h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #fecaca;">Order Cancellation Notice</p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 14px; color: #1e293b; margin: 0 0 12px 0;">
            Dear <strong>${order.address?.name || 'Customer'}</strong>,
          </p>
          <p style="font-size: 13px; color: #475569; line-height: 1.5; margin: 0 0 16px 0;">
            As per your request, your order <strong>#${order.orderId}</strong> has been successfully cancelled.
          </p>

          <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 13px;">
            <div style="color: #9f1239; font-weight: bold; margin-bottom: 4px;">Cancellation Reason:</div>
            <div style="color: #be123c;">"${reason || 'Customer requested cancellation'}"</div>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 13px;">
            <div style="color: #166534; font-weight: bold; margin-bottom: 4px;">Refund Status:</div>
            <div style="color: #15803d;">
              ${
                order.paymentMethod === 'COD'
                  ? 'No payment was collected for this Cash on Delivery order.'
                  : `Full refund of ₹${order.pricing?.totalPayable?.toLocaleString('en-IN')} has been initiated to your original payment method (${order.paymentMethod}). It should reflect in your account within 2-4 business days.`
              }
            </div>
          </div>

          <p style="font-size: 12px; color: #64748b; margin: 0;">
            We hope to see you again soon on ZapKart.
          </p>
        </div>

        <div style="padding: 16px 24px; background-color: #0f172a; color: #94a3b8; font-size: 11px; text-align: center;">
          ZapKart Support • orders@zapkart.in
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate Admin Cancellation Alert Email
 */
export const generateAdminCancellationAlertHTML = (order, reason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/><title>ADMIN ALERT: Order Cancelled - ZapKart</title></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 2px solid #ef4444;">
        <div style="background-color: #991b1b; padding: 18px 24px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 18px;">⚠️ Warehouse Alert: Order Cancelled</h2>
          <span style="font-size: 12px; color: #fecaca;">Immediately halt shipping for #${order.orderId}</span>
        </div>
        <div style="padding: 24px; font-size: 13px; color: #334155;">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Customer:</strong> ${order.address?.name} (${order.address?.phone})</p>
          <p><strong>Reason Stated:</strong> ${reason}</p>
          <p><strong>Payment Mode:</strong> ${order.paymentMethod} (Amount: ₹${order.pricing?.totalPayable?.toLocaleString('en-IN')})</p>
          <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 10px; border-radius: 6px; font-size: 12px; color: #991b1b;">
            Action: Return inventory to active warehouse bins and verify payment gateway refund webhook.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Dispatch Order Placed Notifications (Both Customer & Company Admin)
 */
export const dispatchOrderPlacedEmails = async (order, customerEmail = 'customer@example.com') => {
  const timestamp = new Date().toISOString();

  // 1. Customer Email
  const customerEmailRecord = {
    id: `email-cust-${Date.now()}`,
    type: 'CUSTOMER_ORDER_CONFIRMATION',
    recipient: customerEmail,
    recipientRole: 'Customer',
    subject: `Order Confirmed: #${order.orderId} - ZapKart`,
    orderId: order.orderId,
    timestamp,
    status: 'Delivered (Simulated 200 OK via SMTP/API)',
    htmlContent: generateCustomerOrderEmailHTML(order)
  };
  logEmailDispatch(customerEmailRecord);

  // 2. Company / Admin Email
  const adminEmailRecord = {
    id: `email-admin-${Date.now() + 1}`,
    type: 'ADMIN_NEW_ORDER_ALERT',
    recipient: ADMIN_EMAIL,
    recipientRole: 'ZapKart Ops / Admin',
    subject: `[NEW ORDER ALERT] Order #${order.orderId} (₹${order.pricing?.totalPayable?.toLocaleString('en-IN')})`,
    orderId: order.orderId,
    timestamp,
    status: 'Delivered (Simulated 200 OK via SMTP/API)',
    htmlContent: generateAdminOrderAlertHTML(order)
  };
  logEmailDispatch(adminEmailRecord);

  return { customerEmailRecord, adminEmailRecord };
};

/**
 * Dispatch Order Cancelled Notifications (Both Customer & Company Admin)
 */
export const dispatchOrderCancelledEmails = async (order, reason, customerEmail = 'customer@example.com') => {
  const timestamp = new Date().toISOString();

  // 1. Customer Cancellation Email
  const customerEmailRecord = {
    id: `email-cust-cancel-${Date.now()}`,
    type: 'CUSTOMER_ORDER_CANCELLATION',
    recipient: customerEmail,
    recipientRole: 'Customer',
    subject: `Order #${order.orderId} Cancelled Successfully - ZapKart`,
    orderId: order.orderId,
    timestamp,
    status: 'Delivered (Simulated 200 OK via SMTP/API)',
    htmlContent: generateCustomerCancellationEmailHTML(order, reason)
  };
  logEmailDispatch(customerEmailRecord);

  // 2. Company / Admin Cancellation Alert
  const adminEmailRecord = {
    id: `email-admin-cancel-${Date.now() + 1}`,
    type: 'ADMIN_ORDER_CANCELLED_ALERT',
    recipient: ADMIN_EMAIL,
    recipientRole: 'ZapKart Ops / Admin',
    subject: `[HALT DISPATCH] Order #${order.orderId} Cancelled by Customer`,
    orderId: order.orderId,
    timestamp,
    status: 'Delivered (Simulated 200 OK via SMTP/API)',
    htmlContent: generateAdminCancellationAlertHTML(order, reason)
  };
  logEmailDispatch(adminEmailRecord);

  return { customerEmailRecord, adminEmailRecord };
};
