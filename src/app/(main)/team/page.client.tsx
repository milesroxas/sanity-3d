'use client';

import SectionContainer from '@/components/ui/section-container';
import TeamCard from '@/components/ui/TeamCard';
import TeamModal from '@/components/ui/TeamModal';
import { useTheme } from 'next-themes';
import { Fragment, useCallback, useEffect, useState } from 'react';

type TeamMember = {
  title: Sanity.Team['title'];
  role: Sanity.Team['role'];
  image: Sanity.Team['image'];
  bio: Sanity.Team['bio'];
  email?: Sanity.Team['email'];
  slug?: { current: string };
};

type SelectedMember = TeamMember | null;

export default function TeamPageClient({
  teamMembers,
}: {
  member: TeamMember | null;
  teamMembers: TeamMember[];
}) {
  const { setTheme } = useTheme();
  const [selectedMember, setSelectedMember] = useState<SelectedMember>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check for team member in URL hash on initial load and when hash changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#member=')) {
        const memberSlug = hash.substring(8); // Remove '#member='
        const member = teamMembers.find(m => m.slug?.current === memberSlug);
        if (member) {
          setSelectedMember(member);
          setIsModalOpen(true);
          return;
        }
      }

      // If there's no valid member hash but modal is open, close it
      if (isModalOpen && !hash.startsWith('#member=')) {
        setIsModalOpen(false);
        setTimeout(() => setSelectedMember(null), 300);
      }
    };

    // Check on mount
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [teamMembers, isModalOpen]);

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  // Function to handle opening the modal with a specific team member
  const handleOpenModal = useCallback((member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);

    // Update URL hash with the team member's slug
    if (member.slug?.current) {
      // Use hash fragment instead of query params to avoid page transitions
      window.location.hash = `member=${member.slug.current}`;
    }
  }, []);

  // Function to handle closing the modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);

    // Remove the hash from URL without triggering navigation
    if (window.history.pushState) {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = '';
    }

    // Clear selected member after animation completes
    setTimeout(() => setSelectedMember(null), 300);
  }, []);

  return (
    <Fragment>
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
      {/* Render team cards in client component to enable click handlers */}
      {teamMembers?.length > 0 && (
        <SectionContainer
          padding={{
            padding: 'large',
            direction: 'bottom',
          }}
        >
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((teamMember, index) => (
              <div
                key={teamMember.slug?.current || index}
                className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <TeamCard
                  title={teamMember.title}
                  excerpt={teamMember.role}
                  image={teamMember.image}
                  bio={teamMember.bio}
                  email={teamMember.email}
                  onClick={() => handleOpenModal(teamMember)}
                />
              </div>
            ))}
          </div>
        </SectionContainer>
      )}
    </Fragment>
  );
}
