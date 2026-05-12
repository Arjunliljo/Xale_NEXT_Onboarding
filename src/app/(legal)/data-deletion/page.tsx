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
  title: "Data Deletion | Xale",
  description: "How to request removal of your data from Xale",
};

export default function DataDeletionPage() {
  return (
    <LegalPageLayout
      title="Data Deletion Instructions"
      description="How to request removal of your data from Xale"
    >
      <Paragraph>
        At Xale, we respect your right to control your personal data. This page
        explains how you can request deletion of your data from our platform.
      </Paragraph>

      <SectionTitle>1. How to Request Data Deletion</SectionTitle>
      <Paragraph>
        You can request deletion of your data by any of the following methods:
      </Paragraph>
      <BulletList>
        <Bullet>
          <strong>Email:</strong> Send a data deletion request to{" "}
          <a href="mailto:privacy@xale.in" style={{ color: "#1e302a", textDecoration: "underline" }}>
            privacy@xale.in
          </a>{" "}
          with the subject line &quot;Data Deletion Request&quot; and include your
          registered email address
        </Bullet>
        <Bullet>
          <strong>In-App:</strong> Contact support through the Xale CRM
          dashboard to request account and data deletion
        </Bullet>
      </BulletList>

      <SectionTitle>2. What Data Gets Deleted</SectionTitle>
      <Paragraph>
        Upon a verified deletion request, we will permanently remove:
      </Paragraph>
      <BulletList>
        <Bullet>Your account information (name, email, phone, profile picture)</Bullet>
        <Bullet>All leads and customer data you have stored</Bullet>
        <Bullet>WhatsApp messages, media files, and conversation history</Bullet>
        <Bullet>Call recordings and call log data</Bullet>
        <Bullet>Documents and uploaded files</Bullet>
        <Bullet>Notes, follow-up dates, and activity logs</Bullet>
        <Bullet>Payment and transaction records</Bullet>
        <Bullet>Internal chat messages</Bullet>
        <Bullet>Automation rules and workflow configurations</Bullet>
      </BulletList>

      <SectionTitle>3. Data from Meta (Facebook/Instagram)</SectionTitle>
      <Callout>
        If you connected your Meta account to Xale, all data received from Meta
        — including leads from Lead Generation Forms, Page IDs, and access
        tokens — will be permanently deleted within 30 days of your request.
      </Callout>
      <Paragraph>This includes:</Paragraph>
      <BulletList>
        <Bullet>Lead contact information synced from Meta Lead Ads</Bullet>
        <Bullet>Meta Page connection details and access tokens</Bullet>
        <Bullet>Form submission data and custom field responses</Bullet>
      </BulletList>
      <Paragraph>
        You can also independently revoke Xale&apos;s access to your Meta data by
        visiting your{" "}
        <a
          href="https://www.facebook.com/settings?tab=business_tools"
          style={{ color: "#1e302a", textDecoration: "underline" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook Business Integrations settings
        </a>{" "}
        and removing Xale from the list.
      </Paragraph>

      <SectionTitle>4. Data from WhatsApp Business</SectionTitle>
      <Callout>
        All WhatsApp Business data — including messages, media, delivery
        receipts, and account credentials — will be permanently deleted within
        30 days of your request.
      </Callout>
      <BulletList>
        <Bullet>All inbound and outbound WhatsApp messages</Bullet>
        <Bullet>Media files (images, videos, documents) sent/received via WhatsApp</Bullet>
        <Bullet>Message templates and broadcast campaign data</Bullet>
        <Bullet>WhatsApp Business Account connection details</Bullet>
      </BulletList>

      <SectionTitle>5. Deletion Timeline</SectionTitle>
      <BulletList>
        <Bullet>
          <strong>Acknowledgment:</strong> We will confirm receipt of your
          deletion request within 48 hours
        </Bullet>
        <Bullet>
          <strong>Processing:</strong> Data deletion will be completed within 30
          days of the verified request
        </Bullet>
        <Bullet>
          <strong>Confirmation:</strong> You will receive an email confirming
          that your data has been deleted
        </Bullet>
      </BulletList>

      <SectionTitle>6. Data We May Retain</SectionTitle>
      <Paragraph>
        In limited circumstances, we may retain certain data as required by law:
      </Paragraph>
      <BulletList>
        <Bullet>
          Transaction and billing records required for tax or legal compliance
        </Bullet>
        <Bullet>
          Data necessary to resolve ongoing disputes or enforce our Terms
        </Bullet>
        <Bullet>
          Anonymized, aggregated data that cannot identify you personally
        </Bullet>
      </BulletList>

      <SectionTitle>7. Organization Accounts</SectionTitle>
      <Paragraph>
        If you are part of an organization using Xale, please note:
      </Paragraph>
      <BulletList>
        <Bullet>
          <strong>Individual users:</strong> You can request deletion of your
          personal account data. Shared organizational data (leads, campaigns)
          will remain accessible to other authorized members of your
          organization.
        </Bullet>
        <Bullet>
          <strong>Account owners:</strong> You can request deletion of the entire
          organization account, which will remove all data including leads,
          messages, and files for all users in the organization.
        </Bullet>
      </BulletList>

      <SectionTitle>8. Contact Us</SectionTitle>
      <Paragraph>
        For any questions about data deletion, contact us at:
      </Paragraph>
      <ContactBox />
    </LegalPageLayout>
  );
}
