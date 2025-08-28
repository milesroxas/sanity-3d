'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SectionContainer, { ISectionPadding } from '@/components/ui/section-container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { stegaClean } from 'next-sanity';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

interface SecurityRequestFormProps {
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  title?: string;
  description?: string;
  submitButtonText?: string;
  successMessage?: string;
  notificationEmail?: string;
}

// Form validation schema
const formSchema = z.object({
  // Contact Information
  fullName: z.string().min(1, 'Full name is required'),
  companyName: z.string().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  emailAddress: z.string().email('Please enter a valid email address'),
  preferredContactMethod: z
    .array(z.enum(['phone', 'email', 'text']))
    .min(1, 'Please select at least one contact method'),

  // Service Location
  siteAddress: z.string().min(1, 'Site address is required'),
  locationType: z.enum([
    'hoa-residential',
    'retail-commercial',
    'hotel-resort',
    'construction-site',
    'event-festival',
    'other',
  ]),

  // Service Details
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
    .min(1, 'Please select at least one security type'),
  estimatedStartDate: z.string().min(1, 'Start date is required'),
  estimatedEndDate: z.string().optional(),
  daysHoursCoverage: z.string().min(1, 'Please describe the coverage needed'),
  totalGuardsNeeded: z.string().min(1, 'Number of guards is required'),
  serviceType: z.enum(['ongoing', 'one-time', 'not-sure']),

  // Site/Project/Event Details
  siteDescription: z.string().min(1, 'Please provide a description of the site or event'),
  securityConcerns: z.string().optional(),
  currentProvider: z.enum(['yes', 'no']),
  currentProviderName: z.string().optional(),

  // Additional Information
  specialCertifications: z.string().optional(),
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
  onsiteContact: z.string().optional(),

  // Budget & Preferences
  budgetRange: z.string().optional(),
  hearAboutUs: z.enum(['referral', 'online-search', 'returning-client', 'social-media', 'other']),

  // Agreement
  agreementConsent: z
    .boolean()
    .refine(val => val === true, 'You must acknowledge the disclaimer to proceed'),
});

type FormData = z.infer<typeof formSchema>;

interface UploadedFile {
  name: string;
  url: string;
  assetId?: string;
  size?: number;
}

export default function SecurityRequestForm({
  padding,
  direction,
  colorVariant = 'background',
  title = 'Security Request Form',
  description,
  submitButtonText = 'Submit Request',
  successMessage = "Thank you for your security request. We'll contact you within 24 hours.",
  notificationEmail,
}: Partial<SecurityRequestFormProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      phoneNumber: '',
      emailAddress: '',
      preferredContactMethod: [],
      siteAddress: '',
      locationType: 'hoa-residential',
      securityTypes: [],
      estimatedStartDate: '',
      estimatedEndDate: '',
      daysHoursCoverage: '',
      totalGuardsNeeded: '',
      serviceType: 'ongoing',
      siteDescription: '',
      securityConcerns: '',
      currentProvider: 'no',
      currentProviderName: '',
      specialCertifications: '',
      patrolRequirements: [],
      onsiteContact: '',
      budgetRange: '',
      hearAboutUs: 'referral',
      agreementConsent: false,
    },
  });

  const { isSubmitting } = form.formState;
  const watchCurrentProvider = form.watch('currentProvider');

  // Use useMemo for stable values to prevent hydration mismatches
  const color = useMemo(() => {
    return colorVariant ? stegaClean(colorVariant) : 'background';
  }, [colorVariant]);

  // Combine padding and direction into ISectionPadding object
  const sectionPadding: ISectionPadding | undefined = useMemo(() => {
    return padding && direction
      ? {
          padding: stegaClean(padding),
          direction: stegaClean(direction),
        }
      : undefined;
  }, [padding, direction]);

  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Security limits
    const MAX_FILES_PER_UPLOAD = 5;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_TOTAL_FILES = 5;

    // Check if adding these files would exceed the total limit
    if (uploadedFiles.length + files.length > MAX_TOTAL_FILES) {
      toast.error(`Maximum ${MAX_TOTAL_FILES} files allowed per form`);
      return;
    }

    // Check if too many files selected at once
    if (files.length > MAX_FILES_PER_UPLOAD) {
      toast.error(`Please select no more than ${MAX_FILES_PER_UPLOAD} files at once`);
      return;
    }

    // Validate file sizes before upload
    const oversizedFiles = Array.from(files).filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.error(
        `Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 5MB per file.`
      );
      return;
    }

    // Validate file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Only PDF, DOC, DOCX, and images are allowed.`
      );
      return;
    }

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async file => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-to-sanity', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return {
          name: file.name,
          url: data.asset.url,
          assetId: data.asset._id,
          size: data.asset.size,
        };
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as UploadedFile[];

      if (successfulUploads.length > 0) {
        setUploadedFiles(prev => [...prev, ...successfulUploads]);
        toast.success(`Successfully uploaded ${successfulUploads.length} file(s)`);
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Some files failed to upload');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [uploadedFiles]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleFormSubmit = useCallback(
    async (data: FormData) => {
      try {
        // In a real implementation, you would send this to your API
        const response = await fetch('/api/security-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            notificationEmail: stegaClean(notificationEmail),
            attachments: uploadedFiles,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const message = result.requestId
            ? `${successMessage} Your request ID is: ${result.requestId}`
            : successMessage;
          toast.success(message);
          form.reset();
          setUploadedFiles([]);
        } else {
          const result = await response.json();
          toast.error(result.error || 'Failed to submit form. Please try again.');
        }
      } catch (error: unknown) {
        console.error('Form submission error:', error);
        toast.error('Failed to submit form. Please try again.');
      }
    },
    [form, successMessage, notificationEmail, uploadedFiles]
  );

  const contactMethodOptions = [
    { id: 'phone', label: 'Phone' },
    { id: 'email', label: 'Email' },
    { id: 'text', label: 'Text' },
  ];

  const securityTypeOptions = [
    { id: 'standing-guards', label: 'Standing Guards' },
    { id: 'patrols', label: 'Patrols' },
    { id: 'gate-access', label: 'Gate Access' },
    { id: 'event-security', label: 'Event Security' },
    { id: 'construction-security', label: 'Construction Security' },
    { id: 'mobile-patrol', label: 'Mobile Patrol' },
    { id: 'other', label: 'Other' },
  ];

  const patrolOptions = [
    { id: 'indoor', label: 'Indoor' },
    { id: 'outdoor', label: 'Outdoor' },
    { id: 'gate-access-points', label: 'Gate/Access Points' },
    { id: 'parking-lots', label: 'Parking Lots' },
    { id: 'perimeter-fencing', label: 'Perimeter Fencing' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <SectionContainer color={color} padding={sectionPadding}>
      <div className="mx-auto max-w-4xl">
        {title && <h2 className="mb-4 text-3xl font-bold">{title}</h2>}
        {description && <p className="mb-8 text-lg text-muted-foreground">{description}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">1️⃣ Contact Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company / HOA / Event Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Optional" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="(555) 123-4567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="you@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferredContactMethod"
                render={() => (
                  <FormItem>
                    <FormLabel>Preferred Contact Method *</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      {contactMethodOptions.map(option => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="preferredContactMethod"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id as any)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(
                                          field.value?.filter(value => value !== option.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Service Location */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">2️⃣ Service Location</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="siteAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name or Address *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter site address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Location *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hoa-residential">HOA/Residential</SelectItem>
                          <SelectItem value="retail-commercial">Retail/Commercial</SelectItem>
                          <SelectItem value="hotel-resort">Hotel/Resort</SelectItem>
                          <SelectItem value="construction-site">Construction Site</SelectItem>
                          <SelectItem value="event-festival">Event/Festival</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">3️⃣ Service Details</h3>

              <FormField
                control={form.control}
                name="securityTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>What type of security are you interested in? *</FormLabel>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {securityTypeOptions.map(option => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="securityTypes"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id as any)}
                                  onCheckedChange={checked => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(
                                          field.value?.filter(value => value !== option.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="estimatedStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Start Date *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated End Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="daysHoursCoverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days & Hours of Coverage Needed *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="e.g., Mon–Fri overnight 10 PM–6 AM"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="totalGuardsNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Number of Guards Needed *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" placeholder="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is this an ongoing or one-time service? *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="one-time">One-time</SelectItem>
                          <SelectItem value="not-sure">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Site/Project/Event Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">4️⃣ Site/Project/Event Details</h3>

              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brief Description of Site or Event *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the property, event, or location that needs security"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityConcerns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known security concerns or recent incidents?</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Optional: Describe any specific security concerns"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Are you currently using another security provider? *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchCurrentProvider === 'yes' && (
                <FormField
                  control={form.control}
                  name="currentProviderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Current Provider</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter provider name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">5️⃣ Additional Information</h3>

              <FormField
                control={form.control}
                name="specialCertifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special certifications or clearances required?</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Armed guards, CPR certified, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patrolRequirements"
                render={() => (
                  <FormItem>
                    <FormLabel>Will patrols be required?</FormLabel>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {patrolOptions.map(option => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="patrolRequirements"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id as any)}
                                  onCheckedChange={checked => {
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValue, option.id])
                                      : field.onChange(
                                          currentValue.filter(value => value !== option.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="onsiteContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>On-site contact name & phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name and phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Budget & Preferences */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">6️⃣ Budget & Preferences</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="budgetRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target budget range</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Optional" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hearAboutUs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about O'Linn Security? *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="online-search">Online Search</SelectItem>
                          <SelectItem value="returning-client">Returning Client</SelectItem>
                          <SelectItem value="social-media">Social Media</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">7️⃣ Upload Section</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Upload any site maps, layouts, or photos</FormLabel>
                  <span className="text-xs text-muted-foreground">
                    {uploadedFiles.length}/5 files
                  </span>
                </div>

                {/* Upload Area */}
                <div
                  className={`flex items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                    uploadedFiles.length >= 5
                      ? 'cursor-not-allowed border-muted-foreground/10 bg-muted/20'
                      : isUploading
                        ? 'cursor-wait border-primary bg-primary/5'
                        : 'cursor-pointer border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onClick={uploadedFiles.length < 5 ? handleFileUpload : undefined}
                >
                  <div className="text-center">
                    {isUploading ? (
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    ) : (
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">
                      {uploadedFiles.length >= 5
                        ? 'Maximum file limit reached'
                        : isUploading
                          ? 'Uploading files...'
                          : 'Click to upload files or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, JPG, PNG • Max 5 files • 5MB each
                    </p>
                  </div>
                </div>

                {/* File List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md border bg-background p-3"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate text-sm">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Agreement & Submission */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">8️⃣ Agreement & Submission</h3>

              <FormField
                control={form.control}
                name="agreementConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        I acknowledge that submitting this form does not guarantee services until a
                        formal contract is signed. *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto" size="lg">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitButtonText}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SectionContainer>
  );
}
