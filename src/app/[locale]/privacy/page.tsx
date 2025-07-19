"use client";

import React from "react";
import { useTranslations } from "use-intl";
import { Heading } from "../../components/heading";
import Block from "../../template/block";
import { Divider } from "../../components/divider";

export default function Privacy() {
  const t = useTranslations();
  return (
    <Block>
      <div className="flex items-end justify-between gap-4 px-8 pt-8">
        <Heading className="max-sm:text-xl">Privacy policy</Heading>

      </div>
      <Divider className="mt-6 mb-4" soft />
      <div className="mt-4 px-8 pb-4 text-sm">
          <p>Thank you for choosing DeflationCoin ("we", "our", or "us"). This Privacy Policy explains how we collect,
              use, disclose, and safeguard your personal data when you use our mobile application (the "App") available
              on Google Play and App Store. By downloading or using our App, you consent to this Privacy Policy.</p>

          <h3 className="text-md font-semibold pt-2">Information We Collect</h3>
          <ul className="list-decimal list-inside indent-8 -ml-4">
              <li><strong>Personal Data:</strong> Name, email address, phone number (optional), and other details
                  voluntarily provided during registration or support requests.</li>
              <li><strong>Financial Data:</strong> Cryptocurrency transaction information conducted through the App,
                  including Smart-Staking details, Smart Dividends, and other financial mechanisms.</li>
              <li><strong>Usage and Device Data:</strong> Device model, operating system, IP address, device
                  identifier, app usage statistics, and analytics data.</li>
          </ul>

          <h3 className="text-md font-semibold pt-2">How We Use Your Information</h3>
          <p className="mt-4">We use your information to:</p>
          <ul className="list-decimal list-inside indent-8 -ml-4">
              <li>Provide, maintain, and improve our services and the DeflationCoin ecosystem.</li>
              <li>Facilitate secure cryptocurrency transactions within the App, including Smart-Staking and dividend
                  payments.</li>
              <li>Provide customer support and respond to your requests.</li>
              <li>Analyze user interactions to improve App performance and user experience.</li>
              <li>Comply with applicable laws and regulatory requirements.</li>
          </ul>

          <h3 className="text-md font-semibold pt-2">Information Sharing and Disclosure</h3>
          <p className="mt-4">We do not sell your personal information. Your information may be shared:</p>
          <ul className="list-decimal list-inside indent-8 -ml-4">
              <li>With third-party service providers assisting with app operations (blockchain networks, hosting,
                  analytics providers).</li>
              <li>To comply with laws, regulations, legal processes, or government requests.</li>
              <li>To protect our rights, security, and the rights of our users and third parties.</li>
          </ul>

          <h2>Security</h2>
          <p>We implement industry-standard security measures to protect your data, although no digital transmission
              or storage method can guarantee absolute security.</p>

          <h2>Third-Party Links and Services</h2>
          <p>The App may contain links to third-party services or blockchain platforms. We are not responsible for
              their privacy practices. Users should review third-party privacy policies directly.</p>

          <h2>Children’s Privacy</h2>
          <p>Our App is not intended for individuals under the age of 18. We do not knowingly collect data from
              minors. If we discover data from minors, we will promptly delete it.</p>

          <h2>Your Privacy Rights</h2>
          <p>You have the right, depending on your jurisdiction, to access, modify, or delete your personal data.
              Please contact us to exercise these rights.</p>

          <h2>Data Retention</h2>
          <p>We retain your data only as long as necessary to fulfill the purposes outlined in this Privacy Policy,
              comply with legal obligations, or resolve disputes.</p>

          <h2>Changes to this Privacy Policy</h2>
          <p>We may update this policy periodically. Updates will be reflected by changing the "Effective Date" at
              the top. Please review this policy regularly.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <p><strong>Email:</strong> support@deflationcoin.com</p>

          <p>Thank you for trusting DeflationCoin.</p>
      </div>
    </Block>
  );
}
