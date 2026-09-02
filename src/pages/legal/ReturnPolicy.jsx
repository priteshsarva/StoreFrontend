import React from 'react';
import { brand, BrandEmail, Brandphone, BrandUrl } from '../../data/data';

const ReturnPolicy = () => {
  return (
    <>
      <div className="w-full px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Refund and Returns Policy</h3>

            <p className="mb-4">
              At <span className="font-semibold">{brand}</span>, we want you to be completely satisfied with your purchase. We have a hassle-free return and refund policy in place for your convenience. Please read our policy below for more information.
            </p>

            <p className="mb-2">
              <strong className="font-semibold">Return Eligibility:</strong>
              You can return a product if it is damaged, defective, or if you have received the wrong product. To be eligible for a return, the product must be unused, in its original packaging, with all tags attached.
              <span className="font-semibold text-red-600">An unboxing video is a must for a return or exchange.</span>
              Without an unboxing video, no return or exchange will be accepted.
            </p>

            <p className="mb-2">
              <strong className="font-semibold">Return Period:</strong>
              You must initiate the return process within 7 days of receiving the product. If you fail to do so, the return request will not be accepted.
            </p>

            <p className="mb-2">
              <strong className="font-semibold">Exchange:</strong>
              If you have received a damaged or defective product, you can also opt for an exchange. Our customer care team will guide you through the process and ensure that you receive the replacement product at the earliest.
            </p>

            <p className="mb-2">
              Please note that our return and refund policy is subject to change without prior notice. We encourage you to review our policy periodically for any updates. If you have any further questions or concerns, please feel free to contact us.
            </p>

            <p className="mt-6 font-medium">
              Thank you <span className="font-semibold">{brand}</span> for choosing us for your fashion needs!
            </p>

            <div className="mt-6">
              <p>For assistance, you can reach us at:</p>
              <p>
                <a href={`mailto:${BrandEmail}`} className="">
                  {BrandEmail}
                </a>
              </p>
              <p><strong>Phone: </strong><a href={`tel:${Brandphone.replace(/\s+/g, '')}`} className="">{Brandphone}</a></p>
              <p><strong>Website: </strong><a href={`https://${BrandUrl}`} className="" target="_blank" rel="noopener noreferrer">{BrandUrl}</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicy;
