import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Row,
  Section,
  Text,
} from '@react-email/components';

// Type for the form data
interface SecurityRequestData {
  requestId?: string;
  fullName: string;
  companyName?: string;
  phoneNumber: string;
  emailAddress: string;
  preferredContactMethod: string[];
  siteAddress: string;
  locationType: string;
  securityTypes: string[];
  estimatedStartDate: string;
  estimatedEndDate?: string;
  daysHoursCoverage: string;
  totalGuardsNeeded: string;
  serviceType: string;
  siteDescription: string;
  securityConcerns?: string;
  currentProvider: string;
  currentProviderName?: string;
  specialCertifications?: string;
  patrolRequirements?: string[];
  onsiteContact?: string;
  budgetRange?: string;
  hearAboutUs: string;
  attachments?: { name: string; url: string; assetId?: string; size?: number }[];
}

// Helper function to format array values
const formatArray = (arr?: string[]) => {
  if (!arr || arr.length === 0) return 'None selected';
  return arr.join(', ');
};

// Helper function to format enum values
const formatEnumValue = (value: string) => {
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Business notification email template
export function SecurityRequestNotificationEmail({ data }: { data: SecurityRequestData }) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f6f6f6',
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            padding: '20px',
          }}
        >
          <Heading style={{ color: '#1f2937', fontSize: '24px', marginBottom: '20px' }}>
            🚨 New Security Request Form Submission
          </Heading>

          <Text style={{ color: '#374151', fontSize: '16px', marginBottom: '20px' }}>
            A new security request has been submitted through your website. Please review the
            details below:
          </Text>

          {/* Contact Information */}
          <Section style={{ marginBottom: '30px' }}>
            <Heading
              style={{
                color: '#1f2937',
                fontSize: '18px',
                marginBottom: '15px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '5px',
              }}
            >
              📞 Contact Information
            </Heading>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Full Name:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{data.fullName}</Text>
              </Column>
            </Row>
            {data.companyName && (
              <Row>
                <Column style={{ width: '30%' }}>
                  <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Company:</Text>
                </Column>
                <Column style={{ width: '70%' }}>
                  <Text style={{ margin: '5px 0' }}>{data.companyName}</Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Phone:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{data.phoneNumber}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Email:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{data.emailAddress}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Preferred Contact:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{formatArray(data.preferredContactMethod)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Service Location */}
          <Section style={{ marginBottom: '30px' }}>
            <Heading
              style={{
                color: '#1f2937',
                fontSize: '18px',
                marginBottom: '15px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '5px',
              }}
            >
              📍 Service Location
            </Heading>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Site Address:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{data.siteAddress}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Location Type:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{formatEnumValue(data.locationType)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Service Details */}
          <Section style={{ marginBottom: '30px' }}>
            <Heading
              style={{
                color: '#1f2937',
                fontSize: '18px',
                marginBottom: '15px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '5px',
              }}
            >
              🛡️ Service Details
            </Heading>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Security Types:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>
                  {data.securityTypes.map(formatEnumValue).join(', ')}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Start Date:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{data.estimatedStartDate}</Text>
              </Column>
            </Row>
            {data.estimatedEndDate && (
              <Row>
                <Column style={{ width: '30%' }}>
                  <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>End Date:</Text>
                </Column>
                <Column style={{ width: '70%' }}>
                  <Text style={{ margin: '5px 0' }}>{data.estimatedEndDate}</Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Coverage:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{data.daysHoursCoverage}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Guards Needed:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{data.totalGuardsNeeded}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Service Type:</Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{formatEnumValue(data.serviceType)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Site Details */}
          <Section style={{ marginBottom: '30px' }}>
            <Heading
              style={{
                color: '#1f2937',
                fontSize: '18px',
                marginBottom: '15px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '5px',
              }}
            >
              🏢 Site Details
            </Heading>
            <Row>
              <Column>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Site Description:</Text>
                <Text
                  style={{
                    margin: '5px 0',
                    backgroundColor: '#f9fafb',
                    padding: '10px',
                    borderRadius: '4px',
                  }}
                >
                  {data.siteDescription}
                </Text>
              </Column>
            </Row>
            {data.securityConcerns && (
              <Row>
                <Column>
                  <Text style={{ fontWeight: 'bold', margin: '15px 0 5px 0' }}>
                    Security Concerns:
                  </Text>
                  <Text
                    style={{
                      margin: '5px 0',
                      backgroundColor: '#f9fafb',
                      padding: '10px',
                      borderRadius: '4px',
                    }}
                  >
                    {data.securityConcerns}
                  </Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '15px 0 5px 0' }}>
                  Current Provider:
                </Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '15px 0 5px 0' }}>
                  {data.currentProvider === 'yes' ? 'Yes' : 'No'}
                </Text>
              </Column>
            </Row>
            {data.currentProviderName && (
              <Row>
                <Column style={{ width: '30%' }}>
                  <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Provider Name:</Text>
                </Column>
                <Column style={{ width: '70%' }}>
                  <Text style={{ margin: '5px 0' }}>{data.currentProviderName}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Additional Information */}
          <Section style={{ marginBottom: '30px' }}>
            <Heading
              style={{
                color: '#1f2937',
                fontSize: '18px',
                marginBottom: '15px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '5px',
              }}
            >
              📋 Additional Information
            </Heading>
            {data.specialCertifications && (
              <Row>
                <Column style={{ width: '30%' }}>
                  <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>
                    Special Certifications:
                  </Text>
                </Column>
                <Column style={{ width: '70%' }}>
                  <Text style={{ margin: '5px 0' }}>{data.specialCertifications}</Text>
                </Column>
              </Row>
            )}
            {data.patrolRequirements && data.patrolRequirements.length > 0 && (
              <Row>
                <Column style={{ width: '30%' }}>
                  <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Patrol Requirements:</Text>
                </Column>
                <Column style={{ width: '70%' }}>
                  <Text style={{ margin: '5px 0' }}>
                    {data.patrolRequirements.map(formatEnumValue).join(', ')}
                  </Text>
                </Column>
              </Row>
            )}
            {data.onsiteContact && (
              <Row>
                <Column style={{ width: '30%' }}>
                  <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>On-site Contact:</Text>
                </Column>
                <Column style={{ width: '70%' }}>
                  <Text style={{ margin: '5px 0' }}>{data.onsiteContact}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Budget & Preferences */}
          <Section style={{ marginBottom: '30px' }}>
            <Heading
              style={{
                color: '#1f2937',
                fontSize: '18px',
                marginBottom: '15px',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '5px',
              }}
            >
              💰 Budget & Preferences
            </Heading>
            {data.budgetRange && (
              <Row>
                <Column style={{ width: '30%' }}>
                  <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>Budget Range:</Text>
                </Column>
                <Column style={{ width: '70%' }}>
                  <Text style={{ margin: '5px 0' }}>{data.budgetRange}</Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={{ width: '30%' }}>
                <Text style={{ fontWeight: 'bold', margin: '5px 0' }}>
                  How they heard about us:
                </Text>
              </Column>
              <Column style={{ width: '70%' }}>
                <Text style={{ margin: '5px 0' }}>{formatEnumValue(data.hearAboutUs)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Attachments */}
          {data.attachments && data.attachments.length > 0 && (
            <Section style={{ marginBottom: '30px' }}>
              <Heading
                style={{
                  color: '#1f2937',
                  fontSize: '18px',
                  marginBottom: '15px',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '5px',
                }}
              >
                📎 Attachments ({data.attachments.length})
              </Heading>
              {data.attachments.map((file, index) => (
                <Row key={index} style={{ marginBottom: '10px' }}>
                  <Column>
                    <Text style={{ margin: '5px 0' }}>
                      <a
                        href={file.url}
                        style={{
                          color: '#2563eb',
                          textDecoration: 'underline',
                        }}
                      >
                        📄 {file.name}
                      </a>
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          <Hr style={{ margin: '30px 0', borderColor: '#e5e7eb' }} />

          <Text style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
            This email was generated automatically from the O'Linn Security website form submission.
            <br />
            Please respond to this inquiry within 24 hours.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// User confirmation email template
export function SecurityRequestConfirmationEmail({
  name,
  requestId,
}: {
  name: string;
  requestId: string;
}) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f6f6f6',
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            padding: '20px',
          }}
        >
          <Heading
            style={{
              color: '#1f2937',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            🛡️ O'Linn Security
          </Heading>

          <Heading style={{ color: '#1f2937', fontSize: '20px', marginBottom: '20px' }}>
            Security Request Received
          </Heading>

          <Text style={{ color: '#374151', fontSize: '16px', marginBottom: '20px' }}>
            Dear {name},
          </Text>

          <Text style={{ color: '#374151', fontSize: '16px', marginBottom: '20px' }}>
            Thank you for submitting your security request through our website. We have received
            your inquiry and will review it promptly.
          </Text>

          <Section
            style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <Text style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>
              Request ID: {requestId}
            </Text>
            <Text style={{ margin: '0' }}>Please keep this reference number for your records.</Text>
          </Section>

          <Heading style={{ color: '#1f2937', fontSize: '18px', marginBottom: '15px' }}>
            What happens next?
          </Heading>

          <Section style={{ marginBottom: '20px' }}>
            <Text style={{ margin: '10px 0' }}>
              ✅ <strong>Within 2 hours:</strong> Our team will review your request
            </Text>
            <Text style={{ margin: '10px 0' }}>
              📞 <strong>Within 24 hours:</strong> We'll contact you to discuss your security needs
            </Text>
            <Text style={{ margin: '10px 0' }}>
              📋 <strong>Within 48 hours:</strong> You'll receive a customized security proposal
            </Text>
          </Section>

          <Text style={{ color: '#374151', fontSize: '16px', marginBottom: '20px' }}>
            If you have any immediate questions or need urgent assistance, please don't hesitate to
            contact us directly:
          </Text>

          <Section
            style={{
              backgroundColor: '#1f2937',
              color: '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <Text style={{ margin: '5px 0', color: '#ffffff' }}>
              📞 <strong>Phone:</strong> {process.env.NEXT_PUBLIC_CONTACT_PHONE || '(555) 123-4567'}
            </Text>
            <Text style={{ margin: '5px 0', color: '#ffffff' }}>
              ✉️ <strong>Email:</strong>{' '}
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@olinn.com'}
            </Text>
            <Text style={{ margin: '5px 0', color: '#ffffff' }}>
              🌐 <strong>Website:</strong> {process.env.NEXT_PUBLIC_SITE_URL || 'https://olinn.com'}
            </Text>
          </Section>

          <Hr style={{ margin: '30px 0', borderColor: '#e5e7eb' }} />

          <Text style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
            Thank you for choosing O'Linn Security for your security needs.
            <br />
            We look forward to protecting what matters most to you.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
