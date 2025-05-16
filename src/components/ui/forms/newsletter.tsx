'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SectionContainer from '@/components/ui/section-container';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { stegaClean } from 'next-sanity';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

interface FormNewsletterProps {
  padding: {
    top: boolean;
    bottom: boolean;
  };
  colorVariant:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  consentText: string;
  buttonText: string;
  successMessage: string;
  inputClassName?: string;
  buttonClassName?: string;
  className?: string;
}

// Form validation schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Please enter your email',
    })
    .email({
      message: 'Please enter a valid email',
    }),
});

export default function FormNewsletter({
  padding,
  colorVariant = 'transparent',
  consentText,
  buttonText = 'Subscribe',
  successMessage = 'Thank you for subscribing!',
  inputClassName,
  buttonClassName,
  className,
}: Partial<FormNewsletterProps>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting } = form.formState;

  // Use useMemo for stable values to prevent hydration mismatches
  const color = useMemo(() => {
    return colorVariant ? stegaClean(colorVariant) : 'transparent';
  }, [colorVariant]);

  const handleSend = useCallback(
    async ({ email }: { email: string }) => {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast(successMessage);
          form.reset();
        } else {
          toast.error(result.error);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        } else {
          toast.error('An unexpected error occurred');
          throw new Error('An unexpected error occurred');
        }
      }
    },
    [form, successMessage]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleSend(values);
  }

  return (
    <SectionContainer color={color} padding={padding} className={className} theme="dark">
      <Form {...form}>
        <form className="w-full pt-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                      // ignore 1 Password autofill
                      data-1p-ignore
                      className={inputClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={`h-9 ${buttonClassName || ''}`}
              size="sm"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
              {buttonText}
            </Button>
          </div>
          {consentText && <p className="mt-4 text-xs">{consentText}</p>}
        </form>
      </Form>
    </SectionContainer>
  );
}
