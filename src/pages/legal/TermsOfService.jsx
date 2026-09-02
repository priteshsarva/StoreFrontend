import React from 'react';
import { brand, BrandEmail, Brandphone, BrandUrl } from '../../data/data';

const TermsOfService = () => {
  return (
    <div className="w-full px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-10">

          <h3 className="text-3xl font-bold mb-6">Terms of Service</h3>

          <p className="mb-4">
            Welcome to <span className="font-semibold">{brand}</span>,
            <a href={`https://${BrandUrl}`} className="font-semibold" target="_blank" rel="noopener noreferrer">{`https://${BrandUrl}`}</a>. 
            By using our website, you agree to the following terms and conditions. Please read them carefully as they govern your access and use of our services.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">1. Acceptance of Terms</h3>
          <p className="mb-4">
            By accessing or using our website, you agree to comply with and be bound by these <strong>Terms of Service</strong>, along with our 
            <strong>Privacy Policy</strong> and other policies posted on the website. If you do not agree to these terms, you are prohibited from using our website and services.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">2. Eligibility</h3>
          <p className="mb-4">
            To make purchases on our website, you must be at least 18 years old or the age of majority in your jurisdiction. 
            By using our services, you warrant that you meet these eligibility requirements.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">3. Product Availability and Accuracy</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Availability</strong>: We make every effort to ensure that our product inventory is accurate. However, availability may change without notice, and we reserve the right to limit or discontinue any product.</li>
            <li><strong>Product Descriptions</strong>: We strive for accuracy in our product descriptions, images, and pricing. However, we do not guarantee that product descriptions, images, or other content is free from errors, and we reserve the right to correct any inaccuracies.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-3">4. Pricing and Payments</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Pricing</strong>: All prices on our website are listed in <strong>Indian Rupees (INR)</strong> and include any applicable taxes unless otherwise stated.</li>
            <li><strong>Payment Methods</strong>: We accept various payment methods, including credit/debit cards, UPI, and cash on delivery. By providing payment information, you agree that you are authorized to use the payment method.</li>
            <li><strong>Order Cancellation</strong>: We reserve the right to cancel any order if there is an issue with product availability, pricing errors, or suspicion of fraud. In such cases, you will be notified, and any payment made will be refunded.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-3">5. Shipping and Delivery</h3>
          <p className="mb-4">
            For information regarding shipping, delivery times, and shipping charges, please refer to our <strong>Shipping Policy</strong>.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">6. Returns and Refunds</h3>
          <p className="mb-4">
            Our return and refund policy is outlined in our <strong>Refund and Returns Policy</strong>. Please review it before making a purchase.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">7. Intellectual Property</h3>
          <p className="mb-4">
            All content, including logos, product images, designs, and text, are the property of <strong>{brand}</strong> or its licensors. 
            You may not use, reproduce, distribute, or modify any content without prior written consent from us.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">8. User Conduct</h3>
          <p className="mb-2">You agree to use our website only for lawful purposes and in accordance with these terms. You are prohibited from:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Engaging in fraudulent activity.</li>
            <li>Uploading harmful or malicious content.</li>
            <li>Interfering with the security or functionality of our website.</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-3">9. Limitation of Liability</h3>
          <p className="mb-4">
            To the fullest extent permitted by law, <strong>{brand}</strong> and its affiliates will not be liable for any direct, indirect, incidental, 
            or consequential damages arising from your use of our website, products, or inability to access our services.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">10. Indemnification</h3>
          <p className="mb-4">
            You agree to indemnify and hold harmless <strong>{brand}</strong>, its employees, directors, and affiliates from any claims, damages, 
            or expenses arising from your violation of these <strong>Terms of Service</strong> or misuse of our website.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">11. Modifications to Terms</h3>
          <p className="mb-4">
            We reserve the right to update or modify these <strong>Terms of Service</strong> at any time without prior notice. 
            It is your responsibility to review these terms regularly. Your continued use of the website constitutes your acceptance of any changes.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">12. Governing Law</h3>
          <p className="mb-4">
            These <strong>Terms of Service</strong> are governed by and construed in accordance with the laws of <strong>India</strong>, 
            without regard to its conflict of law provisions.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-3">13. Contact Us</h3>
          <p className="mb-2">If you have any questions or concerns regarding these terms, please contact us:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Email</strong>: <a href={`mailto:${BrandEmail}`} className="">{BrandEmail}</a></li>
            <li><strong>Phone</strong>: <a href={`tel:${Brandphone.replace(/\s+/g, '')}`} className="">{Brandphone}</a></li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
