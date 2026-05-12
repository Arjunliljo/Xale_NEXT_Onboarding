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
  title: "Privacy Policy | Xale",
  description: "How we collect, use, and protect your information",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How we collect, use, and protect your information"
    >
      <Paragraph>
        Xale is a proprietary platform operated by Marketlube. Xale (&quot;we,&quot;
        &quot;our,&quot; or &quot;us&quot;) operates the Xale CRM platform accessible at xale.in.
        This policy explains how we collect, use, and protect your information.
      </Paragraph>

      <SectionTitle>1. Information We Collect</SectionTitle>
      <Paragraph>
        <strong>Account Information</strong>
      </Paragraph>
      <BulletList>
        <Bullet>Full name, email address, and phone number</Bullet>
        <Bullet>Password (stored securely in hashed form)</Bullet>
        <Bullet>Profile picture and organization details</Bullet>
      </BulletList>

      <Paragraph>
        <strong>Lead &amp; Customer Data</strong>
      </Paragraph>
      <BulletList>
        <Bullet>Contact information (name, email, phone, WhatsApp number, address)</Bullet>
        <Bullet>Sales pipeline stage, status history, and activity logs</Bullet>
        <Bullet>Notes, follow-up dates, payment records, and documents</Bullet>
      </BulletList>

      <Paragraph>
        <strong>Communication Data</strong>
      </Paragraph>
      <BulletList>
        <Bullet>
          <strong>WhatsApp messages:</strong> Content, media files, delivery/read
          receipts, timestamps, and sender/recipient phone numbers
        </Bullet>
        <Bullet>
          <strong>Call logs:</strong> Recordings, duration, direction, status,
          and associated phone numbers
        </Bullet>
        <Bullet>
          <strong>Internal chat:</strong> Messages exchanged between team members
          within the platform
        </Bullet>
      </BulletList>

      <Paragraph>
        <strong>Data from Third-Party Integrations</strong>
      </Paragraph>
      <BulletList>
        <Bullet>
          <strong>Meta (Facebook/Instagram) Lead Ads:</strong> Lead contact info
          submitted through your Meta Lead Generation Forms — names, emails,
          phone numbers, custom form responses, Page IDs, and access tokens
        </Bullet>
        <Bullet>
          <strong>WhatsApp Business API:</strong> Business Account ID, phone
          number, message templates, and all messages/media exchanged
        </Bullet>
        <Bullet>
          <strong>Google OAuth (Sign-In):</strong> Email address and display
          name from your Google profile
        </Bullet>
        <Bullet>
          <strong>Gmail API (gmail.send scope):</strong> Your Gmail email
          address, display name, OAuth refresh and access tokens (encrypted at
          rest), and metadata of messages you send through Xale (subject,
          recipients, send time, message ID returned by Google). Xale never
          requests, reads, indexes, or stores the contents of your inbox or
          received messages.
        </Bullet>
        <Bullet>
          <strong>TeleCMI:</strong> Call metadata, recordings, and agent
          assignment data
        </Bullet>
      </BulletList>

      <Paragraph>
        <strong>Automatically Collected</strong>
      </Paragraph>
      <BulletList>
        <Bullet>IP address, browser type, device info, and usage patterns</Bullet>
        <Bullet>Login timestamps, session data, and cookies</Bullet>
      </BulletList>

      <SectionTitle>2. How We Use Your Information</SectionTitle>
      <BulletList>
        <Bullet>Provide, operate, and maintain the CRM Service</Bullet>
        <Bullet>Sync leads from Meta Lead Ads, WhatsApp, and telephony providers</Bullet>
        <Bullet>Facilitate WhatsApp messaging — one-on-one and broadcast campaigns</Bullet>
        <Bullet>Enable call tracking, recording, and logging</Bullet>
        <Bullet>Provide analytics, reporting, and sales pipeline management</Bullet>
        <Bullet>Process payments and manage subscriptions</Bullet>
        <Bullet>Send transactional emails (OTP, notifications)</Bullet>
        <Bullet>Automate workflows and lead distribution</Bullet>
        <Bullet>Maintain audit trails and activity logs</Bullet>
        <Bullet>Improve and optimize the Service</Bullet>
        <Bullet>Comply with legal obligations</Bullet>
      </BulletList>

      <SectionTitle>3. Meta Platform Data</SectionTitle>
      <Callout>
        We comply with Meta Platform Terms. Data from Meta is used exclusively
        to provide CRM services you have requested. We do not sell, license, or
        distribute Meta user data to third parties.
      </Callout>
      <BulletList>
        <Bullet>
          We access lead data from your Meta Lead Generation Forms solely to
          import and manage leads within your Xale workspace
        </Bullet>
        <Bullet>
          Meta data is used exclusively for lead management, follow-ups, and
          sales pipeline tracking — never for advertising, data brokering, or
          profiling
        </Bullet>
        <Bullet>
          Access tokens are stored securely and used only to maintain active sync
          between Meta and your workspace
        </Bullet>
        <Bullet>
          You may disconnect your Meta integration at any time from Lead Sources
          in your dashboard
        </Bullet>
        <Bullet>
          Upon disconnection or account deletion, all Meta-sourced data is
          deleted within 30 days, unless retention is required by law
        </Bullet>
      </BulletList>

      <SectionTitle>4. WhatsApp Business Data</SectionTitle>
      <Callout>
        We comply with WhatsApp Business Platform policies and Meta&apos;s terms of
        service. Message content is processed solely to deliver the messaging
        service to you.
      </Callout>
      <BulletList>
        <Bullet>
          Messages are processed solely to provide messaging capabilities within
          the CRM
        </Bullet>
        <Bullet>
          Message content, media, and receipts are stored to maintain
          conversation history for your business records
        </Bullet>
        <Bullet>
          We do not read, analyze, or use message content for any purpose other
          than delivering the service
        </Bullet>
        <Bullet>
          WhatsApp credentials and tokens are stored securely and used only for
          the integration
        </Bullet>
        <Bullet>
          You may disconnect your WhatsApp Business Account at any time
        </Bullet>
      </BulletList>

      <SectionTitle>5. Gmail Integration &amp; Google Limited Use</SectionTitle>
      <Callout>
        Xale&apos;s use and transfer of information received from Google APIs to any
        other app will adhere to{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1e302a", textDecoration: "underline" }}
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </Callout>
      <Paragraph>
        When you connect a Gmail account to Xale, we request only the
        <code style={{ margin: "0 4px", padding: "1px 4px", borderRadius: "3px", backgroundColor: "#f0f3f1" }}>
          https://www.googleapis.com/auth/gmail.send
        </code>
        OAuth scope. This scope grants Xale permission to send mail on your
        behalf. It does <strong>not</strong> grant access to read, list, modify,
        or delete messages in your Gmail inbox, drafts, sent folder, labels, or
        any other Gmail data.
      </Paragraph>
      <Paragraph>
        <strong>How we use Gmail data:</strong>
      </Paragraph>
      <BulletList>
        <Bullet>
          To deliver outbound emails composed by you (or by an automation you
          configured) to recipients you specify within your Xale workspace.
        </Bullet>
        <Bullet>
          To display a record of emails Xale itself has sent, alongside the
          associated lead or deal in your CRM. Only metadata and the body Xale
          composed are stored — never inbox content.
        </Bullet>
        <Bullet>
          To maintain the OAuth connection (refresh access tokens, surface a
          reconnect prompt if Google revokes access).
        </Bullet>
      </BulletList>
      <Paragraph>
        <strong>What we do NOT do with Gmail data:</strong>
      </Paragraph>
      <BulletList>
        <Bullet>
          We do not transfer Gmail data to third parties except as necessary to
          provide or improve the user-facing features of Xale, to comply with
          applicable law, or as part of a merger, acquisition, or sale of
          assets with appropriate notice.
        </Bullet>
        <Bullet>
          We do not use Gmail data for serving advertising, building advertising
          profiles, or any advertising purpose.
        </Bullet>
        <Bullet>
          We do not allow humans to read Gmail data, except (a) with your
          explicit consent for specific messages, (b) where necessary for
          security purposes such as investigating abuse, (c) where required by
          law, or (d) where the data has been aggregated and anonymized for
          internal operations such as service quality.
        </Bullet>
        <Bullet>
          We do not use Gmail data to train or improve generalized or
          third-party AI/ML models.
        </Bullet>
      </BulletList>
      <Paragraph>
        <strong>Token security:</strong>
      </Paragraph>
      <BulletList>
        <Bullet>
          OAuth refresh and access tokens are encrypted at rest using AES-256-GCM
          before they are written to our database.
        </Bullet>
        <Bullet>
          Tokens are never logged, never displayed in the UI, and never returned
          in API responses.
        </Bullet>
        <Bullet>
          You can revoke Xale&apos;s access to your Gmail at any time from{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1e302a", textDecoration: "underline" }}
          >
            myaccount.google.com/permissions
          </a>
          {" "}or by clicking &quot;Disconnect&quot; in Settings → Apps inside Xale. Upon
          disconnection, Xale revokes the refresh token with Google and deletes
          the encrypted tokens from our database. The historical record of
          emails Xale already sent is retained on the relevant lead/deal
          timeline (in line with Section 8 below); you can request its deletion
          at any time.
        </Bullet>
      </BulletList>

      <SectionTitle>6. Data Sharing &amp; Disclosure</SectionTitle>
      <Paragraph>
        We do not sell your personal data. We share information only:
      </Paragraph>
      <BulletList>
        <Bullet>
          <strong>Service Providers:</strong> Cloud hosting (DigitalOcean), file
          storage (S3-compatible), payments (Razorpay), email (SMTP), telephony
          (TeleCMI) — bound by contractual data protections
        </Bullet>
        <Bullet>
          <strong>Platform Integrations:</strong> Data exchanged with Meta,
          WhatsApp, Google as needed for the features you enable
        </Bullet>
        <Bullet>
          <strong>Within Your Organization:</strong> Data accessible to team
          members based on role-based access control (Owner, Admin, Manager,
          Staff, Viewer)
        </Bullet>
        <Bullet>
          <strong>Legal Requirements:</strong> When required by law, regulation,
          or governmental request
        </Bullet>
        <Bullet>
          <strong>Business Transfers:</strong> In case of merger or acquisition,
          with prior notice
        </Bullet>
      </BulletList>

      <SectionTitle>7. Data Storage &amp; Security</SectionTitle>
      <BulletList>
        <Bullet>Passwords hashed using bcrypt — never stored in plaintext</Bullet>
        <Bullet>JWT-based authentication with expiration policies</Bullet>
        <Bullet>Files and media stored in encrypted cloud storage (S3)</Bullet>
        <Bullet>Multi-tenant architecture ensures strict data isolation</Bullet>
        <Bullet>Role-based access control restricts data to authorized users</Bullet>
        <Bullet>CORS policies, input validation, and security hardening</Bullet>
      </BulletList>

      <SectionTitle>8. Data Retention</SectionTitle>
      <BulletList>
        <Bullet>Account data retained while your account is active</Bullet>
        <Bullet>
          Upon deletion, all data (leads, messages, recordings, documents)
          permanently deleted within 30 days
        </Bullet>
        <Bullet>Meta-sourced data deleted within 30 days of disconnection</Bullet>
      </BulletList>

      <SectionTitle>9. Your Rights</SectionTitle>
      <Paragraph>Depending on your jurisdiction, you may:</Paragraph>
      <BulletList>
        <Bullet>Access, correct, or delete your personal data</Bullet>
        <Bullet>Request data portability in a machine-readable format</Bullet>
        <Bullet>Withdraw consent or object to processing</Bullet>
      </BulletList>
      <Paragraph>
        Contact us at{" "}
        <a href="mailto:privacy@xale.in" style={{ color: "#1e302a", textDecoration: "underline" }}>
          privacy@xale.in
        </a>{" "}
        to exercise these rights.
      </Paragraph>

      <SectionTitle>10. Cookies</SectionTitle>
      <Paragraph>
        We use essential cookies for authentication and session management. You
        can manage preferences through your browser settings.
      </Paragraph>

      <SectionTitle>11. Children&apos;s Privacy</SectionTitle>
      <Paragraph>
        The Service is not intended for individuals under 18. We do not knowingly
        collect data from children.
      </Paragraph>

      <SectionTitle>12. Changes to This Policy</SectionTitle>
      <Paragraph>
        We may update this policy and will notify you by posting the revised
        version with an updated date. Continued use constitutes acceptance.
      </Paragraph>

      <SectionTitle>13. Contact Us</SectionTitle>
      <ContactBox />
    </LegalPageLayout>
  );
}
