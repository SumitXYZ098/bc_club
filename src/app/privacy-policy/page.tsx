import Description, {
  IDescriptionTypes,
} from "@/src/components/description/Description";
import Heading, { IHeadingTypes } from "@/src/components/heading/Heading";
import React from "react";

const page = () => {
  return (
    <section className="mt-25 max-w-6xl mx-auto w-full md:px-13 px-6 xl:space-y-15 space">
      <Heading
        tagType="h1"
        type={IHeadingTypes.heading48}
        content="BC Club Privacy Policy"
        customClasses="text-center"
      />
      <div className="xl:xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Introduction"
        />
        <div className="space-y-3">
          <Description
            type={IDescriptionTypes.dec18}
            content="Welcome and thank you for your interest in BC Club (operated by BC Club Online Search Inc.). At BC Club, we deeply value your privacy and the trust you place in us. This Privacy Statement transparently outlines our practices related to the collection, use, protection, and responsible disclosure of your personal information, ensuring your privacy rights are respected and protected."
          />
          <Description
            type={IDescriptionTypes.dec18}
            content="In our digital age, safeguarding personal information is more than a policy; it's a fundamental aspect of our ethical commitment to you, our valued users. Whether you're browsing BC Club.ca (the “Website”) or exploring our services, we want you to feel secure and informed every step of the way."
          />
          <Description
            type={IDescriptionTypes.dec18}
            content="This statement outlines the types of personal information we may collect during your interaction with the Website, the rationale behind its collection, how we intend to use it to enhance your experience, and under what circumstances we might disclose it. We are dedicated to not only complying with the Personal Information Protection Act (PIPA) of British Columbia, and the Personal Information Protection and Electronic Document Act (PIPEDA) of Canada, but also exceeding its standards to protect your privacy. "
          />
          <Description
            type={IDescriptionTypes.dec18}
            content="By accessing and using the Website, you acknowledge that you have read, understood, and agree to the terms outlined in this Privacy Statement. We encourage you to review this statement thoroughly and reach out to us with any questions or concerns. "
          />
          <Description
            type={IDescriptionTypes.dec18}
            content="For disputes specifically related to privacy concerns, we aim for amicable resolutions. However, if an agreement cannot be reached, disputes will be resolved through arbitration in British Columbia, Canada, as detailed in our Terms of Use, ensuring a fair and expedited process. "
          />
          <Description type={IDescriptionTypes.dec18} content="" />
        </div>
      </div>

      <div className="xl:xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="What is Personal Information? "
        />

        <Description
          type={IDescriptionTypes.dec18}
          content="“Personal Information” means any information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a specific individual. It does not include anonymized or aggregated information that cannot reasonably be linked to a specific person. "
        />
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Information We Collect"
        />
        <div className="space-y-3">
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="a) Information You Provide"
            />
            <ul className="list-disc list-inside ml-4 md:text-lg text-base">
              <li>Contact details (e.g., name, email, phone number)</li>
              <li>
                Property-related information (e.g., home address, property
                preferences)
              </li>
              <li>
                Messages or content submitted through our forms or Website{" "}
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="b) Automatically Collected Information"
            />
            <ul className="list-disc list-inside ml-4 md:text-lg text-base">
              <li>IP address, browser type, device information, OS</li>
              <li>Access times, page views, session duration, referral URLs</li>
              <li>Location data (approximate or, with permission, precise)</li>
              <li>Cookies, beacons, pixels, and similar technologies</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="c) Information from Third Parties"
            />
            <ul className="list-disc list-inside ml-4 md:text-lg text-base">
              <li>Business partners (e.g., agents, brokers)</li>
              <li>Public data sources</li>
              <li>
                Social media and third-party sign-in platforms (e.g., Google,
                Facebook)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="How We Use Your Information"
        />
        <ul className="list-disc list-inside ml-4 md:text-lg text-base">
          <li>Operate and improve the Website</li>
          <li>
            Connect you with real estate agents, lawyers, brokers, and other
            professionals
          </li>
          <li>
            Send marketing, transactional, and service-related communications
          </li>
          <li>Conduct analytics and performance monitoring</li>
          <li>Respond to inquiries and provide customer support</li>
          <li>Comply with legal obligations</li>
        </ul>
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Sharing Your Information"
        />
        <div className="space-y-3">
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="a) Real Estate Professionals"
            />
            <Description
              type={IDescriptionTypes.dec18}
              content="Real Estate Agents, Mortgage brokers, and lawyers to help facilitate your real estate transactions."
            />
          </div>
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="b) Business Partners and Affiliates"
            />
            <Description
              type={IDescriptionTypes.dec18}
              content="For referral, lead sharing, analytics, and marketing support."
            />
          </div>
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="c) Service Providers"
            />
            <Description
              type={IDescriptionTypes.dec18}
              content="Vendors that help operate our services (e.g., hosting, marketing, support, analytics, payment processors)."
            />
          </div>
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="d) Legal Authorities"
            />
            <Description
              type={IDescriptionTypes.dec18}
              content="Where required by law or to protect rights and safety."
            />
          </div>
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="e) With Your Consent"
            />
            <Description
              type={IDescriptionTypes.dec18}
              content="When you request it or give us permission."
            />
          </div>
          <div className="space-y-2">
            <Heading
              tagType="h3"
              type={IHeadingTypes.heading30}
              content="f) In Corporate Transactions"
            />
            <Description
              type={IDescriptionTypes.dec18}
              content="In case of mergers, acquisitions, financing, or similar events."
            />
          </div>
          <Description
            type={IDescriptionTypes.dec18}
            content="You can opt out of this by emailing support@BCClub.ca. "
          />
        </div>
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Aggregated and De-Identified Data"
        />
        <div className="space-y-2">
          <Description
            type={IDescriptionTypes.dec18}
            content="We may use and share anonymized or aggregated data that does not identify individuals for:"
          />
          <ul className="list-disc list-inside ml-4 md:text-lg text-base">
            <li>Market research and trend analysis</li>
            <li>Product development</li>
            <li>Monetization through partnerships or publication</li>
          </ul>
          <Description
            type={IDescriptionTypes.dec18}
            content="We do not attempt to re-identify this data."
          />
        </div>
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Cookies and Tracking"
        />
        <ul className="list-disc list-inside ml-4 md:text-lg text-base">
          <li>Improve Platform performance and usability</li>
          <li>Analyze traffic and trends</li>
          <li>Remember your preferences</li>
          <li>Deliver targeted advertising and content</li>
        </ul>
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Your Privacy Choices"
        />
        <ul className="list-disc list-inside ml-4 md:text-lg text-base">
          <li>IAccess or Correct Info: Contactsupport@BCClub.ca </li>
          <li>Opt Out of Marketing: Use unsubscribe links or email us</li>
          <li>Data Sharing Opt-Out: Emailsupport@BCClub.ca</li>
          <li>Withdraw Location Access: Use your device/browser settings</li>
          <li>Delete Account/Data: Contact us for deletion requests</li>
        </ul>
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Data Retention"
        />
        <div className="space-y-2">
          <Description
            type={IDescriptionTypes.dec18}
            content="We retain personal data as long as needed to:"
          />
          <ul className="list-disc list-inside ml-4 md:text-lg text-base">
            <li>Provide services and support</li>
            <li>Comply with legal or regulatory requirements</li>
            <li>Support auditing, dispute resolution, or security needs</li>
          </ul>
          <Description
            type={IDescriptionTypes.dec18}
            content="Data no longer needed is securely deleted or anonymized."
          />
        </div>
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Security"
        />
        <Description
          type={IDescriptionTypes.dec18}
          content="We use technical and organizational safeguards to protect your data. However, no method of transmission or storage is completely secure. You use the Website at your own risk."
        />
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Age Privacy"
        />
        <Description
          type={IDescriptionTypes.dec18}
          content="The Website is not directed to individuals under the age of 19. We do not knowingly collect personal information from individuals under the age of 19. If we learn we’ve collected data from an individual under the age of 19, we will delete it promptly."
        />
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Third-Party Sites and Services"
        />
        <Description
          type={IDescriptionTypes.dec18}
          content="Our Website may contain links to or integrations with third-party websites or services. We are not responsible for their privacy practices. Please review their policies separately."
        />
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-10 mb-6">
        <Heading
          tagType="h2"
          type={IHeadingTypes.heading32}
          content="Changes to This Policy"
        />
        <Description
          type={IDescriptionTypes.dec18}
          content="We may update this Privacy Policy from time to time. Changes will be posted with an updated effective date. Material changes will be communicated as required by law."
        />
      </div>

      <div className="xl:space-y-4 space-y-2 xl:mb-20 mb-10 ">
        <Heading tagType="h2" type={IHeadingTypes.heading32} content="" />
        <Description type={IDescriptionTypes.dec18} content="" />
      </div>

      
    </section>
  );
};

export default page;
