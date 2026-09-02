import React from 'react'
import { brand, BrandEmail, Brandphone, BrandUrl } from '../../data/data'

const PrivacyPolices = () => {
  return (
<div class="w-full px-4 py-10">
  <div class="max-w-5xl mx-auto">
    <div class="bg-white shadow-md rounded-lg p-6 md:p-10">

      <h3 class="text-3xl font-bold mb-6">Privacy Policy</h3>

      <p class="mb-4">
        At <span class="font-semibold">{brand}</span>, 
        <a href={`https://{BrandUrl}`} class="text-black font-semibold" target="_blank">{BrandUrl}</a>, 
        we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. 
        This Privacy Policy outlines how we collect, use, and protect your data when you visit our website and make purchases.
      </p>

      <h3 class="text-2xl font-semibold mt-8 mb-3">1. Information We Collect</h3>
      <p class="mb-2">When you use our website or make a purchase, we may collect the following types of information:</p>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li><strong>Personal Information</strong>: Name, email address, phone number, billing and shipping address.</li>
        <li><strong>Payment Information</strong>: We collect payment details such as credit card numbers when you make a purchase.</li>
        <li><strong>Technical Data</strong>: IP address, browser type, operating system, and other data regarding your interaction with our website.</li>
        <li><strong>Order Information</strong>: Products you’ve purchased, order history, and any preferences.</li>
      </ul>

      <h3 class="text-2xl font-semibold mt-8 mb-3">2. How We Use Your Information</h3>
      <p class="mb-2">We use your personal information for the following purposes:</p>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li><strong>Order Processing</strong>: To fulfill your orders and deliver products.</li>
        <li><strong>Customer Support</strong>: To communicate with you about your order or any issues you may have.</li>
        <li><strong>Marketing</strong>: With your consent, to send you updates about new products, offers, or services.</li>
        <li><strong>Improving Services</strong>: To analyze and improve our website, products, and customer service experience.</li>
      </ul>

      <h3 class="text-2xl font-semibold mt-8 mb-3">3. Sharing Your Information</h3>
      <p class="mb-2">We do not sell, trade, or rent your personal information. However, we may share your information with:</p>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li><strong>Service Providers</strong>: Third parties that assist us in processing payments, fulfilling orders, and delivering products.</li>
        <li><strong>Legal Compliance</strong>: If required by law, we may share your information to comply with legal obligations.</li>
      </ul>

      <h3 class="text-2xl font-semibold mt-8 mb-3">4. Cookies</h3>
      <p class="mb-2">We use cookies and similar technologies to:</p>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li>Improve your browsing experience on our website.</li>
        <li>Analyze website traffic and improve performance.</li>
        <li>Provide relevant promotions and offers based on your preferences.</li>
      </ul>
      <p class="mb-4">You can control cookies through your browser settings, although disabling them may affect the functionality of our site.</p>

      <h3 class="text-2xl font-semibold mt-8 mb-3">5. Security</h3>
      <p class="mb-4">We take appropriate measures to protect your personal data from unauthorized access, loss, misuse, or alteration. However, no method of data transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

      <h3 class="text-2xl font-semibold mt-8 mb-3">6. Your Rights</h3>
      <p class="mb-2">You have the right to:</p>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li>Access, update, or delete your personal information.</li>
        <li>Opt out of marketing communications.</li>
        <li>Request a copy of the personal data we hold about you.</li>
      </ul>
      <p class="mb-4">To exercise these rights, please contact us at <span class="italic">{BrandEmail}</span>.</p>

      <h3 class="text-2xl font-semibold mt-8 mb-3">7. Changes to This Policy</h3>
      <p class="mb-4">We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date. It is your responsibility to review this page regularly.</p>

      <h3 class="text-2xl font-semibold mt-8 mb-3">8. Contact Us</h3>
      <p class="mb-2">If you have any questions regarding this Privacy Policy, please contact us:</p>
      <ul class="list-disc pl-6 space-y-1">
        <li><strong>Email</strong>: <span class="italic"><a href={`mailto:${BrandEmail}`}> {BrandEmail}</a></span></li>
        <li><strong>Phone</strong>: <span class="italic"> <a href={`tel:${Brandphone.replace(/\s+/g, '')}`}>{Brandphone}</a> </span></li>
      </ul>

    </div>
  </div>
</div>

  )
}

export default PrivacyPolices
