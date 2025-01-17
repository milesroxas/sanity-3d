import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type NewsletterError = {
  message: string;
  code?: string;
  statusCode?: number;
};

export const POST = async (request: Request) => {
  const { email } = await request.json();

  try {
    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    return Response.json({ success: true });
  } catch (error) {
    const resendError = error as NewsletterError;
    console.error("Newsletter subscription error:", resendError);

    return Response.json(
      {
        error: "Error subscribing to updates",
        details: resendError.message,
      },
      {
        status: resendError.statusCode || 400,
      }
    );
  }
};
