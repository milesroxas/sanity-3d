import {
  SecurityRequestConfirmationEmail,
  SecurityRequestNotificationEmail,
} from '@/lib/email-templates';
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { token } from '@/sanity/lib/token';
import { Resend } from 'resend';
import { z } from 'zod';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@olinn.com';
const BUSINESS_NOTIFICATION_EMAIL = process.env.NOTIFY_TO_EMAIL || 'intake@olinn.com';

const schema = z
  .object({
    notificationEmail: z.string().trim().toLowerCase().email().optional(),
    fullName: z.string().trim().min(1),
    companyName: z.string().trim().optional(),
    phoneNumber: z.string().trim().min(1),
    emailAddress: z.string().trim().toLowerCase().email(),
    preferredContactMethod: z.array(z.enum(['phone', 'email', 'text'])).min(1),

    siteAddress: z.string().trim().min(1),
    locationType: z.enum([
      'hoa-residential',
      'retail-commercial',
      'hotel-resort',
      'construction-site',
      'event-festival',
      'other',
    ]),

    securityTypes: z
      .array(
        z.enum([
          'standing-guards',
          'patrols',
          'gate-access',
          'event-security',
          'construction-security',
          'mobile-patrol',
          'other',
        ])
      )
      .min(1),

    estimatedStartDate: z.string().trim().min(1),
    estimatedEndDate: z.string().trim().optional(),
    daysHoursCoverage: z.string().trim().min(1),
    totalGuardsNeeded: z.string().trim().min(1),
    serviceType: z.enum(['ongoing', 'one-time', 'not-sure']),

    siteDescription: z.string().trim().min(1),
    securityConcerns: z.string().trim().optional(),
    currentProvider: z.enum(['yes', 'no']),
    currentProviderName: z.string().trim().optional(),

    specialCertifications: z.string().trim().optional(),
    patrolRequirements: z
      .array(
        z.enum([
          'indoor',
          'outdoor',
          'gate-access-points',
          'parking-lots',
          'perimeter-fencing',
          'other',
        ])
      )
      .optional(),
    onsiteContact: z.string().trim().optional(),

    budgetRange: z.string().trim().optional(),
    hearAboutUs: z.enum(['referral', 'online-search', 'returning-client', 'social-media', 'other']),

    agreementConsent: z.boolean().refine(Boolean, 'Agreement consent is required'),

    attachments: z
      .array(
        z.object({
          name: z.string(),
          url: z.string().url(),
          assetId: z.string().optional(),
          size: z.number().optional(),
        })
      )
      .max(5)
      .optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  try {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const body = parsed.data;
    const requestId = `SR-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

    console.log('Security request received', {
      requestId,
      at: new Date().toISOString(),
      email: body.emailAddress,
      name: body.fullName,
      attachmentCount: body.attachments?.length ?? 0,
    });

    const tags = [{ name: 'form', value: 'security-request' }];

    // Persist to Sanity (non-blocking)
    try {
      const writeClient = client.withConfig({ token });
      const attachments = (body.attachments || [])
        .filter(a => a.assetId)
        .map(a => ({
          _type: 'file',
          _key: a.assetId!,
          asset: { _type: 'reference', _ref: a.assetId! },
        }));

      await writeClient.create({
        _type: 'securityRequest',
        requestId,
        fullName: body.fullName,
        companyName: body.companyName,
        phoneNumber: body.phoneNumber,
        emailAddress: body.emailAddress,
        preferredContactMethod: body.preferredContactMethod,
        siteAddress: body.siteAddress,
        locationType: body.locationType,
        securityTypes: body.securityTypes,
        estimatedStartDate: body.estimatedStartDate,
        estimatedEndDate: body.estimatedEndDate,
        daysHoursCoverage: body.daysHoursCoverage,
        totalGuardsNeeded: body.totalGuardsNeeded,
        serviceType: body.serviceType,
        siteDescription: body.siteDescription,
        securityConcerns: body.securityConcerns,
        currentProvider: body.currentProvider,
        currentProviderName: body.currentProviderName,
        specialCertifications: body.specialCertifications,
        patrolRequirements: body.patrolRequirements,
        onsiteContact: body.onsiteContact,
        budgetRange: body.budgetRange,
        hearAboutUs: body.hearAboutUs,
        attachments,
        status: 'new',
      });
    } catch (e) {
      console.error('Failed to persist security request to Sanity', e);
    }

    // Notify business
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [body.notificationEmail ?? BUSINESS_NOTIFICATION_EMAIL],
        replyTo: body.emailAddress,
        subject: `New Security Request - ${body.fullName} (${requestId})`,
        react: SecurityRequestNotificationEmail({ data: { ...body, requestId } }),
        tags,
      });
    } catch (e) {
      console.error('Business notification failed', e);
    }

    // Confirm to user
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [body.emailAddress],
        subject: "Security Request Received - O'Linn Security",
        react: SecurityRequestConfirmationEmail({ name: body.fullName, requestId }),
        tags,
      });
    } catch (e) {
      console.error('User confirmation failed', e);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Security request submitted successfully. We will contact you within 24 hours.',
        requestId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Security request error', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
