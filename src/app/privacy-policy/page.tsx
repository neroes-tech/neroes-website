import type { Metadata } from "next";

import { PageHero } from "@/components/ui/PageHero";
import { CONTACT_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Neroes Privacy and Security Policy.",
};

const COOKIES = [
  { name: "_ga", lifetime: "2 years", description: "Used to distinguish users" },
  { name: "_gid", lifetime: "24 hours", description: "Used to distinguish users" },
  { name: "_gat", lifetime: "1 minute", description: "Used to control request rate" },
  { name: "Token", lifetime: "Session", description: "Used to identify the user" },
  { name: "Session", lifetime: "–", description: "Used to maintain user session" },
  { name: "AWSALB", lifetime: "6 days", description: "Used to control connections and request rate" },
  { name: "AWSALBCORS", lifetime: "6 days", description: "Used to prevent fraudulent attacks" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy and Security Policy" size="compact" maxWidth="3xl" />

      <section className="bg-background pb-20 md:pb-24">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <article className="prose max-w-none prose-headings:font-exo prose-headings:text-primary prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-a:text-secondary">
          <p>
            This Privacy and Security Policy regulates the use of digital platforms (website and App) owned
            by NEROES.
          </p>
          <p>
            If you wish to contact Neroes regarding these digital platforms, you may do so using the
            following email address{" "}
            <a href="mailto:info@neroes.tech">info@neroes.tech</a>.
          </p>
          <p>
            Access and use of the website and App are the sole responsibility of the User, who is subject to
            the acceptance of this Privacy and Security Policy and the data processing described herein. The
            access and use of the services provided assume that the User has read, understood and accepted
            the Terms and Conditions of their use, that can be consulted{" "}
            <a href="/terms-conditions">here</a>.
          </p>
          <p>
            Neroes reserves the right to change and review this Privacy and Security Policy at any time, as
            well as the data processing described herein, whenever deemed appropriate, with or without prior
            notice.
          </p>
          <p>
            This Privacy Policy constitutes an agreement between you, the User, and NEROES which applies to
            the use of these digital platforms. It is the sole responsibility of the user to read the
            Privacy and Security Policy whenever accessing the website or App, in order to be aware of any
            changes made, as it may affect its rights.
          </p>

          <h2>1. Scope</h2>
          <p>
            This policy intends to inform about the privacy rules in the scope of the services provided by{" "}
            <strong>
              <span lang="pt">[A CONFIRMAR &mdash; nome oficial, NIF e morada da sede]</span>
            </strong>{" "}
            (NEROES), also designated as Responsible Entity. The personal data you provide is treated with the security and
            confidentiality guarantees required by the legal framework relating to the protection of
            personal data.
          </p>
          <p>
            Any attempts to alter the information, or any other action that may cause damage and jeopardize
            the integrity of the system and services, are strictly prohibited under current legislation. The
            User undertakes to scrupulously comply with the applicable legislation, namely, in terms of
            computer crime and intellectual property rights, being solely responsible for the violation of
            these rules.
          </p>
          <p>
            NEROES MENTAL TRAINING PLATFORM is a computational platform (App) that allows the User to
            improve performance through mental training and enhancement of emotional control.
          </p>
          <p>
            This training makes use of the neurofeedback technique combined with a videogame that is
            controlled by the brain&rsquo;s electrical activity signals of the User. These signals are
            collected through a wearable electroencephalography (EEG) device that is placed over the head of
            the User. In addition, the App allows qualitative and quantitative assessments of the mental
            abilities of the User before, during and after the referred mental training, by filling out
            questionnaires, testing specific game/assessments and from the signals of the brain&rsquo;s
            electrical activity themselves.
          </p>
          <p>
            However, it should be noted that the App is not a medical device and does not provide or can be
            used in order to obtain any diagnosis or mental health therapy.
          </p>
          <p>
            The data collected is intended for the provision of the service requested by the User, with no
            personal data being collected that are not necessary to provide the service or without express
            consent of the User.
          </p>
          <p>
            There are other types of information, non-personal and non-individualized, that are recorded to
            keep the website running appropriately and ensure a good browsing experience for visitors. This
            is statistical information that is usually, by definition, recorded through the browser window,
            such as: the website address that brought you directly to the Neroes website, most visited
            website pages, type of browser, operating system, etc.
          </p>

          <h2>2. What is Personal Data?</h2>
          <p>
            Personal data is information relating to a living, identified or identifiable person. Personal
            data can also be considered the set of different information that can lead to the identification
            of a specific person. Personal data that has been uncharacterized, encoded or pseudonymised, but
            that can be used to re-identify a person, remains personal data.
          </p>
          <p>
            Personal data that has been made anonymous so that the person is not or ceases to be
            identifiable are no longer considered personal data. For data to be truly anonymized,
            anonymization must be irreversible.
          </p>
          <p>
            Therefore, the data collected and used by the App, related to the brain&rsquo;s electrical
            activity, with questionnaires and specific tests/assessments available on the App, are only
            considered personal data if associated with a living, identified or identifiable person.
            Otherwise, the data is not considered as personal data.
          </p>
          <p>
            Since the App service will use data encoding or pseudonymisation, it is necessary to obtain
            explicit consent for the treatment of such personal data for one or more specific purposes.
          </p>
          <p>
            However, the data collected is subject to irreversible anonymization and used for the overall
            improvement of the service provided, namely in the optimization of the algorithms used in the
            App, for aggregate statistical evaluation of the usage of the service, and in case the retention
            period ends.
          </p>

          <h2>3. Typology, Purposes of Collection and Processing of Personal Data</h2>
          <p>
            <strong>3.1 Brain&rsquo;s electrical activity signals:</strong> The collection and processing of
            data aims to do mental training through a video game, using the neurofeedback technique, and
            also to evaluate and monitor the mental abilities of the User associated with the training.
          </p>
          <p>
            <strong>3.2 Self-reported questionnaires or reported by institutional employee:</strong> The
            requested and collected data aim to assess mental abilities associated with training,
            personality trait, and also the mental health state of the User. These data will be aggregated
            and combined with the previous data to report the current status, to monitor mental training and
            to optimize the training process.
          </p>
          <p>
            <strong>3.3 Data derived from specific tests/games:</strong> The collected data reflects the
            performance of specific tests/games that assesses mental abilities, which include the duration
            of the execution, rate of correct answers, and scores. These are intended to complement the
            evaluation of the mental abilities of the User, collected during the training. These data will
            be aggregated and combined with the previous data to report the current state of the User,
            monitor the mental training and to optimize the training process itself.
          </p>
          <p>
            <strong>3.4 Demographic data:</strong> The requested and collected data aim, together with the
            previous data, to optimize the training process.
          </p>
          <p>
            <strong>3.5 Contact details:</strong> The requested data is only intended to enable the creation
            of a personal and/or institutional User account. They can also be used to contact the User for
            operation notifications and to obtain feedback on the service provided.
          </p>
          <p>
            <strong>3.6 Anonymization and aggregation of data for service optimization:</strong> The data
            collected is irreversibly anonymized and used by NEROES in an aggregated way to improve the
            service provided through the statistical evaluation of the usage, optimization of the algorithms
            or in case the retention period ends.
          </p>

          <h2>4. User Profile</h2>
          <p>
            The App enables users to create individual and institutional profiles by providing explicit
            consent during profile creation, by accepting the checkbox related to the agreement of the Terms
            and Conditions. This is done prior to using the App.
          </p>
          <p>
            The individual User profile is intended for individuals, over 18 years old. When the user is a
            minor, he/she must be accompanied by the legal guardian, both when giving consent, and when
            using and filling in the App data.
          </p>
          <p>
            The profile of the organization/institutional User (e.g. clubs, companies) allows institutions,
            being responsible for the collection and processing of data of their employees and assuming the
            responsibilities imposed by law in terms of protection of personal data, to enter and collect
            the data of their employees on the App, in a nominal, pseudonymised or anonymized way. In this
            profile, institutions will be able to conduct and monitor the mental training of their employees
            on an individual basis and still have an aggregate view of the group of employees.
          </p>

          <h2>5. Entity Responsible for Data Collection and Processing</h2>
          <p>
            NEROES, in its role as the data controller, is responsible for the collection and processing of
            data in strict compliance with national and community legislation in force. In fulfilling this
            role, NEROES ensures that:
          </p>
          <ul>
            <li>
              The processing of your personal data is carried out within the scope of the purposes for which
              they were collected or for purposes compatible with those.
            </li>
            <li>
              Only the personal data necessary are collected, used, and retained for the specific, explicit
              and legitimate purpose in question.
            </li>
            <li>Personal data is not transmitted to third parties for commercial or advertising purposes.</li>
            <li>Personal data is handled for legally provided purposes or for the provision of services at your request.</li>
          </ul>
          <p>
            In addition to the above, NEROES is committed to implementing appropriate technical and
            organizational measures to protect the personal data of its users against accidental, unlawful
            loss, alteration, dissemination, or unauthorized access. An appropriate level of security is
            considered to be in effect regarding the data handling risks, given the sensitive nature of the
            data to be protected.
          </p>
          <p>
            NEROES utilizes Amazon Web Services (AWS) as a cloud service provider for the storage of data in
            databases. In this capacity, AWS acts as a data processor, processing data on behalf of NEROES.
            The responsibilities and roles in this relationship are as follows:
          </p>
          <ul>
            <li>
              <strong>AWS&rsquo;s Role as Data Processor:</strong> AWS is responsible for securely storing
              data provided by NEROES, adheres to strict security measures and protocols, and does not have
              permission to access or use the data for any purposes other than storage and maintenance as
              instructed by NEROES.
            </li>
            <li>
              <strong>Data Security with AWS:</strong> AWS provides robust physical and digital security
              measures to protect data from unauthorized access, disclosure, alteration, and destruction.
              NEROES, in collaboration with AWS, ensures that all data stored in AWS databases are encrypted
              and securely managed.
            </li>
            <li>
              <strong>Compliance and Auditing:</strong> AWS&rsquo;s services are compliant with major data
              protection regulations and standards. NEROES regularly reviews and audits the data processing
              and storage practices of AWS to ensure ongoing compliance with data protection laws.
            </li>
          </ul>
          <p>
            By using AWS for data storage, NEROES ensures enhanced security and reliability in the management
            of user data. NEROES remains committed to the protection of personal data and will continue to
            uphold the highest standards of data privacy in all aspects of its data collection and
            processing activities.
          </p>
          <p>
            NEROES undertakes to only allow access to the employees or entities under confidentiality
            agreements, as the company&rsquo;s current practice. NEROES may, with express and prior consent,
            only transmit the data to these entities for the purpose of scientific and research studies. The
            transmission of this data will be done in compliance with the rules on the irreversible
            anonymization of personal data.
          </p>

          <h2>6. Personal Data Security Measures and Data Breach Response</h2>
          <p>
            <strong>6.1 Security Measures:</strong> In carrying out its activities, the Responsible Entity
            employs a comprehensive set of technologies and security procedures to protect personal data
            from unauthorized access or disclosure. These include physical security measures (controlled
            access to headquarters&rsquo; facilities, 24x7 equipment monitoring) and logical security
            measures (identity management, authentication and privilege controls, firewalls and intrusion
            detection, network segregation, and encryption of information through secure communication
            channels). NEROES maintains its own database for storing all personal data registered by the
            User, ensuring the protection of this data through both physical and logical security measures.
          </p>
          <p>
            <strong>6.2 Safety Procedures for Special Category Data:</strong> NEROES recognizes that
            physiological signals and self-reported mental health data fall under &lsquo;special category
            data&rsquo; as defined by GDPR, which requires heightened protective measures: strict access
            control limited to personnel who require it, advanced encryption in transit and at rest, data
            minimization and anonymization wherever possible, and specific employee training on the legal
            requirements and risks of processing such data.
          </p>
          <p>
            <strong>6.3 Data Breach Notification Procedures:</strong> In the event of a data breach, NEROES
            has established comprehensive procedures to promptly and effectively respond, especially when
            special category data is involved. This includes breach detection and assessment, notification
            to affected users without undue delay when the breach is likely to result in a high risk to
            their rights and freedoms, notification to the relevant data protection authorities within 72
            hours of becoming aware of the breach, and post-breach mitigation, documentation and review.
          </p>
          <p>
            <strong>6.4 Commitment to Data Integrity and Confidentiality:</strong> NEROES is dedicated to
            maintaining the highest standards of confidentiality and integrity in all personal data
            processing, with a special emphasis on special category data. NEROES may, with your express and
            prior consent, transmit the data for the purpose of scientific studies, in compliance with the
            rules on anonymization of personal data and under the protection of a Non-Disclosure Agreement.
          </p>

          <h2>7. Cross-Border Data Transfers</h2>
          <p>
            In the course of providing services, NEROES may transfer personal data across borders, including
            to regions outside the European Union (EU) and the European Economic Area (EEA), such as the
            EU/EEA, North America (the United States and Canada), Brazil, and Australia.
          </p>
          <p>
            To ensure the protection of personal data when transferred outside the EU/EEA, NEROES adheres to
            the GDPR&rsquo;s stringent data protection standards, relying on adequacy decisions where
            possible, and otherwise on Standard Contractual Clauses approved by the European Commission.
            Users are informed about any cross-border data transfers and the safeguards in place, and by
            accepting the terms and conditions checkbox upon signing up for the App, users explicitly
            consent to such transfers. NEROES regularly reviews its data transfer practices to ensure
            ongoing compliance with GDPR and other relevant data protection laws.
          </p>

          <h2>8. Access and Control of Personal Data</h2>
          <p>
            NEROES is committed to ensuring that Users have full control over their personal data. To this
            end, the following mechanisms are in place:
          </p>
          <p>
            <strong>8.1 Providing Consent:</strong> When a User signs up for the NEROES App, they will
            encounter a clear consent checkbox &mdash; a unified consent action for agreeing to the Terms and
            Conditions and, consequently, to the Privacy Policy of the App. The Privacy Policy is easily
            accessible at the point of signing up, allowing Users to review it in full before giving their
            consent.
          </p>
          <p>
            <strong>8.2 Withdrawing Consent:</strong> Users have the right to withdraw their consent at any
            time, either by deleting the account through the App, or by contacting NEROES at{" "}
            <a href="mailto:info@neroes.tech">info@neroes.tech</a>. Withdrawal of consent will halt
            processing of the user&rsquo;s data for the withdrawn purposes, unless another legal ground for
            processing is applicable. The lawfulness of processing based on consent before its withdrawal
            remains unaffected.
          </p>
          <p>
            <strong>8.3 Access to Personal Data:</strong> Users can request access to their personal data
            held by NEROES, including how it is being used and for what purposes, directly through the App
            or by contacting <a href="mailto:info@neroes.tech">info@neroes.tech</a>.
          </p>
          <p>
            <strong>8.4 Rectification, Erasure, Objection, and Restriction:</strong> Users have the right to
            request rectification of inaccurate personal data, erasure of their data via the App or by
            account deletion, and to object to certain types of data processing or request a restriction on
            processing in specific circumstances, by contacting{" "}
            <a href="mailto:info@neroes.tech">info@neroes.tech</a>.
          </p>
          <p>
            <strong>8.5 Response Time:</strong> NEROES will respond to all personal data rights requests
            within 5 business days, adhering to the timeframes stipulated by applicable data protection
            laws. In cases where immediate action is not feasible due to legal or technical constraints,
            users will be informed of the measures taken as soon as possible.
          </p>
          <p>
            <strong>8.6 Right to Lodge a Complaint:</strong> Users have the right to lodge a complaint with
            the National Data Protection Commission (CNPD) via{" "}
            <a href="https://www.cnpd.pt/" target="_blank" rel="noopener noreferrer">
              www.cnpd.pt
            </a>
            .
          </p>

          <h2>9. Personal Data Retention Period</h2>
          <p>
            Your personal data is retained for the period necessary to fulfill the purposes for which it was
            collected. The specific retention periods are as follows:
          </p>
          <ul>
            <li>
              <strong>Personal data information:</strong> If an account remains inactive for 2 years, NEROES
              reserves the right to irreversibly anonymize all personal and special category data. This data
              will be retained for as long as necessary to maintain active research purposes and used to
              improve the models and algorithms that run within the App.
            </li>
            <li>
              <strong>User profile information:</strong> Contact data related to user accounts, such as
              email addresses or phone numbers, will be retained for the duration of the user&rsquo;s active
              engagement with the services. If the account remains inactive for 2 years, the user profile
              storing the contact information will be deleted. Before the stipulated time, the User can
              delete their account, directly erasing the information from the system.
            </li>
            <li>
              <strong>Transaction data:</strong> Data related to transactions, including purchase history,
              will be retained for a period of 10 years in compliance with financial and accounting
              regulations.
            </li>
          </ul>
          <p>
            The Responsible Entity undertakes to adopt appropriate conservation and safety measures
            throughout the retention period, and remains committed to regular reviews of data retention
            practices to ensure compliance with industry standards and applicable regulations.
          </p>
          <p>
            If you have any specific concerns or questions about the retention period for your personal
            data, please contact <a href="mailto:info@neroes.tech">info@neroes.tech</a>.
          </p>

          <h2>10. Cookie Policy</h2>
          <p>NEROES uses cookies and similar technologies to enhance user experience and improve performance, as detailed below.</p>

          <h3>10.1 What are Cookies?</h3>
          <p>
            Cookies are small text files with relevant information that your access device (computer,
            mobile phone, smartphone, or tablet) carries through the browser when a site is visited. The use
            of cookies optimizes navigation by adapting information and services to user interests,
            providing a better experience with each visit.
          </p>
          <p>
            Cookies used by NEROES do not collect personal information that identifies the user but store
            generic information, such as the place/country of access and user preferences. NEROES uses
            cookies for: ensuring proper page functionality; storing user preferences, language, and font
            size; analyzing anonymous statistical information about user interactions with the website; and
            customizing, adapting, and improving users&rsquo; browsing experience.
          </p>
          <p>
            Users can choose to be notified of and block cookies at any time through their browser. Note
            that refusing cookies may limit access to certain areas of the site and affect the overall
            browsing experience.
          </p>

          <h3>10.2 Types of Cookies</h3>
          <ul>
            <li><strong>Permanent Cookies:</strong> Stored on the device and used whenever the user revisits the site for personalized navigation.</li>
            <li><strong>Session Cookies:</strong> Temporary cookies available until the session ends, providing a better browsing experience.</li>
          </ul>

          <h3>10.3 Functions of Cookies</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for specific website areas, navigation, and application use.</li>
            <li><strong>Feature Cookies:</strong> Recall user preferences for a customized browsing experience.</li>
            <li><strong>Analytic Cookies:</strong> Analyze user site interactions for statistical purposes without collecting personal information.</li>
          </ul>

          <h3>10.4 Cookies in Newsletters/Emails</h3>
          <p>Newsletters/emails may contain a small image for statistical purposes, allowing users to unsubscribe if desired.</p>

          <h3>10.5 Disable the Use of Cookies</h3>
          <p>
            Users can disable cookies at any time through browser settings. However, note that disabling
            cookies may affect web service functionality. For example, in Google Chrome you may do so via{" "}
            <a href="https://support.google.com/chrome" target="_blank" rel="noopener noreferrer">
              Google Chrome support
            </a>
            .
          </p>

          <h3>10.6 Cookies and Similar Technologies in the App</h3>
          <p>
            The App uses cookies for Functionality and Performance, excluding targeted advertising. Users
            can control cookie preferences. The following cookies are used:
          </p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Cookies used by the NEROES App, their lifetime and purpose</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-bold text-foreground">Cookie</th>
                  <th scope="col" className="py-2 pr-4 font-bold text-foreground">Lifetime</th>
                  <th scope="col" className="py-2 font-bold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((cookie) => (
                  <tr key={cookie.name} className="border-b border-border">
                    <td className="py-2 pr-4 text-muted-foreground">{cookie.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{cookie.lifetime}</td>
                    <td className="py-2 text-muted-foreground">{cookie.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            To opt out of non-essential cookies, change your browser settings. Most browsers accept cookies
            by default, but preferences can be adjusted in privacy settings. For more information about
            cookies, including how to disable them, visit{" "}
            <a href="https://aboutcookies.org/" target="_blank" rel="noopener noreferrer">
              aboutcookies.org
            </a>
            .
          </p>

          <h2>11. Questions and Contacts</h2>
          <p>You can contact us to clarify any doubts or questions at the following addresses:</p>
          <ul>
            <li>Email: <a href="mailto:info@neroes.tech">info@neroes.tech</a></li>
            <li>Address: {CONTACT_INFO.address}</li>
          </ul>

          <h2>12. Applicable Law and Competent Forum</h2>
          <p>
            This Privacy and Security Policy is governed and interpreted in accordance with Portuguese law.
            The Lisbon area court is competent, to the exclusion of any other, to settle any conflicts that
            result from the interpretation and application of this Privacy and Security Policy.
          </p>

          <h2>13. Amendment to the Privacy and Security Policy</h2>
          <p>
            This Privacy and Security Policy, which you must read carefully, may be changed, with the
            changes coming into effect as of the date of its publication on this website, with express
            reference to the date of update.
          </p>
          <p>Date of the last update of the Privacy and Security Policy: November 11, 2023.</p>
          </article>
        </div>
      </section>
    </>
  );
}
