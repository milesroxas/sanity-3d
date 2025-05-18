'use client';
import { ReactNode } from 'react';

interface SocialLinkProps {
  url: string;
  label: string;
  icon: ReactNode;
}

interface SocialMediaProps {
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    yelp?: string;
    tiktok?: string;
    googleReviews?: string;
  };
  className?: string;
  iconClassName?: string;
}

const SocialLink = ({
  url,
  label,
  icon,
  className = '',
}: SocialLinkProps & { className?: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
    <span className="sr-only">{label}</span>
    {icon}
  </a>
);

export default function SocialLinks({
  social,
  className = 'flex gap-4',
  iconClassName = 'h-6 w-6',
}: SocialMediaProps) {
  if (!social) return null;

  return (
    <div className={className}>
      {social.facebook && (
        <SocialLink
          url={social.facebook}
          label="Facebook"
          className="hover:text-slate-300"
          icon={
            <svg
              className={iconClassName}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      )}
      {social.instagram && (
        <SocialLink
          url={social.instagram}
          label="Instagram"
          className="hover:text-slate-300"
          icon={
            <svg
              className={iconClassName}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      )}
      {social.twitter && (
        <SocialLink
          url={social.twitter}
          label="Twitter"
          className="hover:text-slate-300"
          icon={
            <svg
              className={iconClassName}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          }
        />
      )}
      {social.linkedin && (
        <SocialLink
          url={social.linkedin}
          label="LinkedIn"
          className="hover:text-slate-300"
          icon={
            <svg
              className={iconClassName}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          }
        />
      )}
      {social.youtube && (
        <SocialLink
          url={social.youtube}
          label="YouTube"
          className="hover:text-slate-300"
          icon={
            <svg
              className={iconClassName}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      )}
      {social.tiktok && (
        <SocialLink
          url={social.tiktok}
          label="TikTok"
          className="hover:text-slate-300"
          icon={
            <svg
              className={iconClassName}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          }
        />
      )}
      {social.yelp && (
        <SocialLink
          url={social.yelp}
          label="Yelp"
          className="hover:text-slate-300"
          icon={
            <svg
              className={iconClassName}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.16 12.594l-4.995 1.433c-.96.275-1.862-.5-1.708-1.464l.78-4.83c.228-1.41 2.115-1.903 3.043-.794l3.438 4.11c.67.802.236 1.878-.557 2.546M9.333 19.054l1.125-5.1c.212-.963 1.401-1.39 2.247-.807l4.265 2.93c1.217.836 1.045 2.684-.3 3.29l-4.99 2.252c-.86.388-1.893-.013-2.347-.564m.695-15.363l-4.234 3.37c-.335.267-.496.683-.468 1.065.036.483.306.932.734 1.125l5.05 2.28c.968.437 2.055-.392 1.867-1.422l-1.134-6.17c-.17-.92-1.272-1.41-1.815-.248M2.89 14.223c-.387-.694-.187-1.378.206-1.905l3.892-5.11c.573-.75 1.738-.663 2.133.213l2.355 5.227c.422.938-.284 1.954-1.26 1.98L3.07 14.776c-.075.004-.138-.014-.2-.045c.014-.004.014-.004.02-.008z" />
            </svg>
          }
        />
      )}
      {social.googleReviews && (
        <SocialLink
          url={social.googleReviews}
          label="Google Reviews"
          className="hover:text-slate-300"
          icon={
            <svg
              className={iconClassName}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 16.01l-4.95-4.95 1.41-1.41 3.54 3.54 7.54-7.54 1.41 1.41-8.95 8.95z" />
            </svg>
          }
        />
      )}
    </div>
  );
}
