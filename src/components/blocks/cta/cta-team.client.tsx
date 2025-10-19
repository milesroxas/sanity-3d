'use client';
import TeamCard from '@/components/ui/TeamCard';
import TeamModal from '@/components/ui/TeamModal';
import { cn } from '@/lib/utils';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

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
  bio?: any;
  email?: string;
}

interface TeamModalContextType {
  openModal: (member: TeamMember) => void;
  selectedMember: TeamMember | null;
  isModalOpen: boolean;
}

const TeamModalContext = createContext<TeamModalContextType | undefined>(undefined);

export function CtaTeamModalProvider({
  children,
  allTeamMembers,
}: {
  children: React.ReactNode;
  allTeamMembers: TeamMember[];
}) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#member=')) {
        const memberSlug = hash.substring(8);
        const member = allTeamMembers.find(m => m.slug?.current === memberSlug);
        if (member) {
          setSelectedMember(member);
          setIsModalOpen(true);
          return;
        }
      }

      if (isModalOpen && !hash.startsWith('#member=')) {
        setIsModalOpen(false);
        setTimeout(() => setSelectedMember(null), 300);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [allTeamMembers, isModalOpen]);

  const openModal = useCallback((member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);

    if (member.slug?.current) {
      window.location.hash = `member=${member.slug.current}`;
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);

    if (window.history.pushState) {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = '';
    }

    setTimeout(() => setSelectedMember(null), 300);
  }, []);

  return (
    <TeamModalContext.Provider value={{ openModal, selectedMember, isModalOpen }}>
      {selectedMember && (
        <TeamModal
          title={selectedMember.title}
          role={selectedMember.role || ''}
          image={selectedMember.image}
          bio={selectedMember.bio}
          email={selectedMember.email}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      {children}
    </TeamModalContext.Provider>
  );
}

function useTeamModal() {
  const context = useContext(TeamModalContext);
  if (context === undefined) {
    throw new Error('useTeamModal must be used within a CtaTeamModalProvider');
  }
  return context;
}

export default function CtaTeamList({
  teamMembers,
  className,
}: {
  teamMembers: TeamMember[];
  className?: string;
}) {
  const { openModal } = useTeamModal();
  const [isPaused, setIsPaused] = useState(false);

  // Split team members into two columns
  const midpoint = Math.ceil(teamMembers.length / 2);
  const leftColumn = teamMembers.slice(0, midpoint);
  const rightColumn = teamMembers.slice(midpoint);

  return (
    <>
      <style jsx>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-scroll {
          animation: scroll-up 30s linear infinite;
        }

        .animate-scroll.paused {
          animation-play-state: paused;
        }

        .scroll-container {
          position: relative;
        }

        .scroll-container::before,
        .scroll-container::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 60px;
          pointer-events: none;
          z-index: 10;
        }

        .scroll-container::before {
          top: 0;
          background: linear-gradient(to bottom, hsl(240, 5%, 96%) 0%, transparent 100%);
        }

        .scroll-container::after {
          bottom: 0;
          background: linear-gradient(to top, hsl(240, 5%, 96%) 0%, transparent 100%);
        }
      `}</style>

      <div
        className={cn(
          'scroll-container grid grid-cols-2 gap-8 md:max-h-[50vh] md:overflow-hidden lg:max-h-[65vh]',
          className
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left column */}
        <div className="relative overflow-hidden">
          <div className={cn('animate-scroll flex flex-col gap-4', isPaused && 'paused')}>
            {/* Original set */}
            {leftColumn.map(member => (
              <TeamCard
                key={member._id}
                title={member.title}
                excerpt={member.role}
                image={member.image}
                onClick={() => openModal(member)}
                size="small"
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {leftColumn.map(member => (
              <TeamCard
                key={`${member._id}-duplicate`}
                title={member.title}
                excerpt={member.role}
                image={member.image}
                onClick={() => openModal(member)}
                size="small"
              />
            ))}
          </div>
        </div>

        {/* Right column with offset */}
        <div className="relative overflow-hidden">
          <div className={cn('animate-scroll flex flex-col gap-4 pt-6', isPaused && 'paused')}>
            {/* Original set */}
            {rightColumn.map(member => (
              <TeamCard
                key={member._id}
                title={member.title}
                excerpt={member.role}
                image={member.image}
                onClick={() => openModal(member)}
                size="small"
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {rightColumn.map(member => (
              <TeamCard
                key={`${member._id}-duplicate`}
                title={member.title}
                excerpt={member.role}
                image={member.image}
                onClick={() => openModal(member)}
                size="small"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
