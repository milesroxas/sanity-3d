'use client';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef } from 'react';

interface TeamMember {
  _id: string;
  title: string;
  role?: string;
  slug: { current: string };
  image?: {
    asset?: {
      _id: string;
      metadata?: {
        lqip?: string;
      };
    };
    alt?: string;
  };
  position?: {
    x: number;
    y: number;
    z?: number;
  };
}

interface EnhancedTeamMember extends TeamMember {
  cardSize: { size: string; className: string };
  xPosition: string;
  yPosition: string;
  isLeftPosition: boolean;
}

interface CtaTeamListProps {
  teamMembers: TeamMember[];
  position?: 'left' | 'right';
}

// Card size options - using relative sizes for better responsiveness
const CARD_SIZES = [
  { size: 'small', className: 'h-24 w-24 md:h-28 md:w-28' },
  { size: 'medium', className: 'h-28 w-28 md:h-32 md:w-32' },
  { size: 'large', className: 'h-32 w-32 md:h-36 md:w-36' },
];

// Deterministic function to get card positions using relative units
const getCardPositions = (
  members: TeamMember[],
  columnPosition: 'left' | 'right'
): EnhancedTeamMember[] => {
  return members.slice(0, 3).map((member, index) => {
    // Use a deterministic size based on index
    const sizeIndex = index % CARD_SIZES.length;

    // Specific positioning based on index using relative units
    let xPosition: string;
    let yPosition: string;

    if (columnPosition === 'left') {
      // Left side positioning
      switch (index) {
        case 0: // Top left card
          xPosition = '20%';
          yPosition = '5%';
          break;
        case 1: // Middle left card
          xPosition = '5%';
          yPosition = '40%';
          break;
        case 2: // Bottom left card
          xPosition = '15%';
          yPosition = '75%';
          break;
        default:
          xPosition = '0%';
          yPosition = '0%';
      }
    } else {
      // Right side positioning
      switch (index) {
        case 0: // Top right card
          xPosition = '20%';
          yPosition = '5%';
          break;
        case 1: // Middle right card
          xPosition = '5%';
          yPosition = '40%';
          break;
        case 2: // Bottom right card
          xPosition = '15%';
          yPosition = '70%';
          break;
        default:
          xPosition = '0%';
          yPosition = '0%';
      }
    }

    return {
      ...member,
      cardSize: CARD_SIZES[sizeIndex],
      xPosition,
      yPosition,
      isLeftPosition: columnPosition === 'left',
    };
  });
};

export default function CtaTeamList({ teamMembers, position = 'left' }: CtaTeamListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use useMemo to compute card positions in a consistent way
  const sizedMembers = useMemo(() => {
    const limitedMembers = teamMembers.slice(0, 3);
    return getCardPositions(limitedMembers, position);
  }, [teamMembers, position]);

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll('.team-card');
      if (!cards || cards.length === 0) return;

      // Clear any existing animations first
      gsap.killTweensOf(cards);

      // Subtle floating animation - very minimal movement to maintain layout
      cards.forEach(card => {
        const floatDistance = 20; // Minimal float distance
        const floatDuration = Math.random() * 1 + 3.5; // 3.5-4.5 second duration
        const floatDelay = Math.random() * 5; // 0-1.5 second delay

        // Create a subtle vertical floating effect
        gsap.to(card, {
          y: `+=${floatDistance}`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          duration: floatDuration,
          delay: floatDelay,
        });
      });
    },
    { scope: containerRef, dependencies: [sizedMembers] }
  );

  return (
    <div className="relative hidden h-full w-full md:block" ref={containerRef}>
      {/* Container with responsive positioning */}
      <div className="relative h-full w-full">
        {sizedMembers.map(member => (
          <TeamMemberCard
            key={member._id}
            member={member}
            cardSize={member.cardSize}
            xPosition={member.xPosition}
            yPosition={member.yPosition}
            isLeftPosition={member.isLeftPosition}
            position={position}
          />
        ))}
      </div>
    </div>
  );
}

// Updated TeamMemberCard with responsive positioning
function TeamMemberCard({
  member,
  cardSize,
  xPosition,
  yPosition,
  isLeftPosition,
  position,
}: {
  member: TeamMember;
  cardSize: { size: string; className: string };
  xPosition: string;
  yPosition: string;
  isLeftPosition: boolean;
  position: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  // Position style using relative units for responsiveness
  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    // Horizontal positioning based on left/right column
    ...(position === 'left'
      ? { left: xPosition } // Left column positioning
      : { right: xPosition }), // Right column positioning
    top: yPosition, // Vertical positioning
  };

  return (
    <Link
      ref={cardRef}
      href={`/team/${member.slug.current}`}
      className={`team-card group relative flex flex-col overflow-hidden rounded-md transition-all duration-300 ease-in-out ${cardSize.className}`}
      data-member-id={member._id}
      data-position={position}
      style={cardStyle}
    >
      {member.image && member.image.asset?._id && (
        <div
          className={`relative overflow-hidden rounded-md transition-all duration-300 group-hover:scale-95 ${cardSize.className}`}
        >
          <Image
            src={urlFor(member.image.asset).url()}
            alt={member.image.alt || `Photo of ${member.title}`}
            placeholder={member.image?.asset?.metadata?.lqip ? 'blur' : undefined}
            blurDataURL={member.image?.asset?.metadata?.lqip || ''}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100px, 200px"
            quality={100}
            className="transition-transform duration-300"
          />
        </div>
      )}

      {/* Info overlay - only visible on hover */}
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-black/70 p-2 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-xs font-bold md:text-sm">{member.title}</h3>
        {member.role && <p className="hidden text-xs sm:block">{member.role}</p>}
      </div>
    </Link>
  );
}
