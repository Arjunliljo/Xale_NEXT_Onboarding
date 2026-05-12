import type { Metadata } from "next";
import LegalPageLayout, {
  SectionTitle,
  Paragraph,
  BulletList,
  Bullet,
  Callout,
  ContactBox,
} from "@/src/components/Legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Xale",
  description: "Rules and guidelines for using the Xale platform",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="Rules and guidelines for using the Xale platform"
    >
      <Paragraph>
        By accessing or using the Xale CRM platform (&quot;Service&quot;), you agree to
        these Terms. If you do not agree, do not use the Service.
      </Paragraph>

      <SectionTitle>1. Description of Service</SectionTitle>
      <Paragraph>
        Xale is a multi-tenant sales and CRM platform providing:
      </Paragraph>
      <BulletList>
        <Bullet>Lead management and sales pipeline tracking</Bullet>
        <Bullet>WhatsApp Business API integration for messaging and broadcasts</Bullet>
        <Bullet>Meta (Facebook/Instagram) Lead Ads integration for lead capture</Bullet>
        <Bullet>Telephony integration for call tracking and recording</Bullet>
        <Bullet>Workflow automation and lead distribution</Bullet>
        <Bullet>Analytics, reporting, and dashboards</Bullet>
        <Bullet>Industry-specific modules (Study Abroad, Video Production, Academy, Travel)</Bullet>
        <Bullet>Team collaboration, document management, and payment tracking</Bullet>
      </BulletList>

      <SectionTitle>2. Account Registration</SectionTitle>
      <BulletList>
        <Bullet>You must provide accurate and complete information</Bullet>
        <Bullet>You are responsible for maintaining credential confidentiality</Bullet>
        <Bullet>You are responsible for all activities under your account</Bullet>
        <Bullet>Notify us immediately of any unauthorized use</Bullet>
        <Bullet>You must be at least 18 years old</Bullet>
        <Bullet>
          Organizations may have multiple users with different roles (Owner,
          Admin, Manager, Staff, Viewer)
        </Bullet>
      </BulletList>

      <SectionTitle>3. Meta (Facebook/Instagram) Integration</SectionTitle>
      <Callout>
        By connecting your Meta account, you authorize Xale to access lead data
        from your Meta Lead Generation Forms in compliance with Meta Platform
        Terms.
      </Callout>
      <BulletList>
        <Bullet>
          You represent that you have the rights and permissions to connect your
          Meta Pages and access lead data
        </Bullet>
        <Bullet>
          You agree to comply with Meta&apos;s Platform Terms and Advertising Policies
          when using lead data
        </Bullet>
        <Bullet>
          You are responsible for ensuring your use of Meta lead data complies
          with applicable laws, including obtaining necessary consents
        </Bullet>
        <Bullet>
          We process Meta data per our Privacy Policy and Meta&apos;s data use
          requirements
        </Bullet>
      </BulletList>

      <SectionTitle>4. WhatsApp Business API</SectionTitle>
      <Callout>
        By connecting your WhatsApp Business Account, you authorize Xale to send
        and receive messages on your behalf in compliance with WhatsApp Business
        Policy.
      </Callout>
      <BulletList>
        <Bullet>
          You agree to comply with WhatsApp&apos;s Business Policy, Commerce Policy,
          and Meta&apos;s terms of service
        </Bullet>
        <Bullet>
          You are solely responsible for message content, including templates and
          broadcasts
        </Bullet>
        <Bullet>
          You must obtain appropriate consent from recipients before messaging
        </Bullet>
        <Bullet>
          You must not use the integration for spam or unsolicited messages
        </Bullet>
        <Bullet>
          We are not responsible for actions taken by Meta/WhatsApp against your
          account due to policy violations
        </Bullet>
      </BulletList>

      <SectionTitle>5. Other Integrations</SectionTitle>
      <Paragraph>
        Use of third-party integrations (Google OAuth, telephony providers,
        payment gateways) is subject to the respective third-party&apos;s terms. We
        are not responsible for availability or conduct of third-party services.
      </Paragraph>

      <SectionTitle>6. Acceptable Use</SectionTitle>
      <Paragraph>You agree not to:</Paragraph>
      <BulletList>
        <Bullet>Use the Service for any unlawful purpose</Bullet>
        <Bullet>Send spam or bulk unsolicited messages via any channel</Bullet>
        <Bullet>Upload viruses, malware, or harmful code</Bullet>
        <Bullet>Attempt unauthorized access to our systems or other accounts</Bullet>
        <Bullet>Interfere with or disrupt the Service</Bullet>
        <Bullet>Scrape or data mine without authorization</Bullet>
        <Bullet>Reverse engineer or decompile the Service</Bullet>
        <Bullet>Resell or redistribute without written consent</Bullet>
      </BulletList>

      <SectionTitle>7. Data Ownership</SectionTitle>
      <BulletList>
        <Bullet>You retain ownership of all data you input</Bullet>
        <Bullet>
          You grant us a limited license to process and store your data to
          provide the Service
        </Bullet>
        <Bullet>
          You are responsible for complying with data protection laws (GDPR,
          CCPA, India&apos;s DPDP Act)
        </Bullet>
        <Bullet>
          As a data controller, you must obtain necessary consents from your
          leads and customers
        </Bullet>
      </BulletList>

      <SectionTitle>8. Subscription &amp; Payments</SectionTitle>
      <BulletList>
        <Bullet>Certain features require a paid subscription</Bullet>
        <Bullet>Fees are billed in advance on a recurring basis</Bullet>
        <Bullet>Payments processed securely through Razorpay</Bullet>
        <Bullet>Pricing changes take effect at your next billing cycle</Bullet>
        <Bullet>
          Refunds handled case-by-case — contact{" "}
          <a href="mailto:support@xale.in" style={{ color: "#1e302a", textDecoration: "underline" }}>
            support@xale.in
          </a>
        </Bullet>
      </BulletList>

      <SectionTitle>9. Intellectual Property</SectionTitle>
      <Paragraph>
        The Service, including design, code, and branding, is owned by Xale and
        protected by intellectual property laws. You may not copy, modify, or
        create derivative works without written consent.
      </Paragraph>

      <SectionTitle>10. Limitation of Liability</SectionTitle>
      <Paragraph>
        To the maximum extent permitted by law, Xale shall not be liable for
        indirect, incidental, special, consequential, or punitive damages. Our
        total liability shall not exceed the amount paid in the 12 months
        preceding the claim.
      </Paragraph>

      <SectionTitle>11. Indemnification</SectionTitle>
      <Paragraph>
        You agree to indemnify Xale from claims arising from your use of the
        Service, violation of these Terms, violation of third-party rights
        (including Meta/WhatsApp policies), or content you manage through the
        Service.
      </Paragraph>

      <SectionTitle>12. Termination</SectionTitle>
      <BulletList>
        <Bullet>You may terminate your account at any time</Bullet>
        <Bullet>We may suspend accounts for Terms violations</Bullet>
        <Bullet>Data deletion upon termination follows our Privacy Policy</Bullet>
      </BulletList>

      <SectionTitle>13. Governing Law</SectionTitle>
      <Paragraph>
        These Terms are governed by the laws of India. Disputes shall be subject
        to the exclusive jurisdiction of courts in India.
      </Paragraph>

      <SectionTitle>14. Changes to Terms</SectionTitle>
      <Paragraph>
        We may modify these Terms and will notify you by posting the revised
        version. Continued use constitutes acceptance.
      </Paragraph>

      <SectionTitle>15. Contact Us</SectionTitle>
      <ContactBox />
    </LegalPageLayout>
  );
}
