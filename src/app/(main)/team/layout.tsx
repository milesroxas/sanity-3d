import { Wrapper } from '@/app/(components)/wrapper';
import { TransitionProvider } from '@/providers/TransitionProvider';

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      <Wrapper lenis>{children}</Wrapper>
    </TransitionProvider>
  );
}
