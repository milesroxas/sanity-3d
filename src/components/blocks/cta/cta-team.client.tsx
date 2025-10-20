// CtaTeam.tsx
'use client';

import { useCursorStore } from '@/components/ui/cursorStore';
import TeamCard from '@/components/ui/TeamCard';
import TeamModal from '@/components/ui/TeamModal';
import { useScrollLockStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

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

function ScrollableColumn({
  members,
  offset = 0,
  isHovered,
}: {
  members: TeamMember[];
  offset?: number;
  isHovered: boolean;
}) {
  const { openModal } = useTeamModal();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(Date.now());

  // Scroll state
  const autoScrollPositionRef = useRef(offset);
  const targetScrollRef = useRef(offset);
  const currentScrollRef = useRef(offset);
  const lastUserScrollTimeRef = useRef(0);

  // Auto-scroll animation when not being user-controlled
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const containerHeight = containerRef.current?.scrollHeight || 0;
      const halfHeight = containerHeight / 2;

      // Continue auto-scroll when not hovered or no recent user interaction
      const hasRecentUserScroll =
        lastUserScrollTimeRef.current > 0 && now - lastUserScrollTimeRef.current < 100;

      if (!isHovered && !hasRecentUserScroll) {
        autoScrollPositionRef.current += delta * 0.02;
        if (autoScrollPositionRef.current >= halfHeight) {
          autoScrollPositionRef.current -= halfHeight;
        }
      }

      // Apply smooth lerp to user scroll
      if (isHovered) {
        const scrollDiff = targetScrollRef.current - currentScrollRef.current;
        currentScrollRef.current += scrollDiff * 0.125;

        // Wrap around for infinite scroll
        if (currentScrollRef.current >= halfHeight) {
          currentScrollRef.current -= halfHeight;
          targetScrollRef.current -= halfHeight;
          autoScrollPositionRef.current = currentScrollRef.current;
        } else if (currentScrollRef.current < 0) {
          currentScrollRef.current += halfHeight;
          targetScrollRef.current += halfHeight;
          autoScrollPositionRef.current = currentScrollRef.current;
        }

        // When hovered but not actively scrolling, keep auto-scroll synced
        if (!hasRecentUserScroll) {
          autoScrollPositionRef.current = currentScrollRef.current;
        }
      } else {
        // Smoothly transition back to auto-scroll
        let diff = autoScrollPositionRef.current - currentScrollRef.current;

        // Normalize difference to shortest path
        if (diff > halfHeight / 2) {
          diff -= halfHeight;
        } else if (diff < -halfHeight / 2) {
          diff += halfHeight;
        }

        currentScrollRef.current += diff * 0.125;
        targetScrollRef.current = currentScrollRef.current;

        // Wrap around for infinite scroll
        if (currentScrollRef.current >= halfHeight) {
          currentScrollRef.current -= halfHeight;
        } else if (currentScrollRef.current < 0) {
          currentScrollRef.current += halfHeight;
        }
      }

      // Apply transform
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(-${currentScrollRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();

    if (!isHovered) return;

    lastUserScrollTimeRef.current = Date.now();
    targetScrollRef.current += e.deltaY * 0.5;
  };

  return (
    <div
      className="relative overflow-hidden"
      onWheel={handleWheel}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
    >
      <div ref={containerRef} className="flex flex-col gap-4">
        {members.map(member => (
          <TeamCard
            key={member._id}
            title={member.title}
            excerpt={member.role}
            image={member.image}
            onClick={() => openModal(member)}
            size="small"
          />
        ))}
        {members.map(member => (
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
  );
}

export default function CtaTeamList({
  teamMembers,
  className,
}: {
  teamMembers: TeamMember[];
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLockScroll, setShouldLockScroll] = useState(false);
  const { acquireScrollLock, releaseScrollLock } = useScrollLockStore();
  const setMode = useCursorStore(s => (s as any).setMode ?? (() => {}));
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCurrentlyHoveredRef = useRef(false);

  // Acquire scroll lock with delay
  useEffect(() => {
    if (shouldLockScroll) {
      acquireScrollLock();
      return () => releaseScrollLock();
    }
    return () => {};
  }, [shouldLockScroll, acquireScrollLock, releaseScrollLock]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setMode('default');
      releaseScrollLock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers with delay for both cursor and scroll lock
  const onEnter = () => {
    isCurrentlyHoveredRef.current = true;
    setIsHovered(true);

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Add delay before locking scroll and changing cursor
    hoverTimeoutRef.current = setTimeout(() => {
      // Only apply if still hovered
      if (isCurrentlyHoveredRef.current) {
        setShouldLockScroll(true);
        setMode('scroll');
      }
      hoverTimeoutRef.current = null;
    }, 800);
  };

  const onLeave = () => {
    isCurrentlyHoveredRef.current = false;
    setIsHovered(false);

    // Clear the timeout if user leaves before delay completes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Immediately reset cursor and scroll lock
    setShouldLockScroll(false);
    setMode('default');
  };

  // Add global mouse move detector to catch when mouse leaves the container area
  // This ensures cursor resets even if onMouseLeave doesn't fire due to animated content
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const checkMousePosition = (e: MouseEvent) => {
      if (!containerRef.current || !isCurrentlyHoveredRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInside && isCurrentlyHoveredRef.current) {
        onLeave();
      }
    };

    document.addEventListener('mousemove', checkMousePosition);
    return () => document.removeEventListener('mousemove', checkMousePosition);
  }, []);

  const midpoint = Math.ceil(teamMembers.length / 2);
  const leftColumn = teamMembers.slice(0, midpoint);
  const rightColumn = teamMembers.slice(midpoint);

  return (
    <>
      <style jsx>{`
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
        ref={containerRef}
        className={cn(
          'scroll-container grid grid-cols-2 gap-8 md:max-h-[50vh] md:overflow-hidden lg:max-h-[65vh]',
          className
        )}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        data-cursor-scope="scroll"
      >
        <ScrollableColumn members={leftColumn} offset={0} isHovered={isHovered} />
        <ScrollableColumn members={rightColumn} offset={24} isHovered={isHovered} />
      </div>
    </>
  );
}
