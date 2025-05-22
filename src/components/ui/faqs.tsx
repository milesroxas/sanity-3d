import PortableTextRenderer from '@/components/portable-text-renderer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SectionContainer, { ISectionPadding } from '@/components/ui/section-container';
import { PortableTextBlock, stegaClean } from 'next-sanity';

interface FAQProps {
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
  title: string;
  faqs: {
    _id: string;
    title: string;
    body: PortableTextBlock[];
  }[];
}

export default function FAQs({ padding, direction, colorVariant, faqs }: Partial<FAQProps>) {
  const color = stegaClean(colorVariant);

  // Combine padding and direction into ISectionPadding object
  const sectionPadding: ISectionPadding | undefined =
    padding && direction
      ? {
          padding: stegaClean(padding),
          direction: stegaClean(direction),
        }
      : undefined;

  return (
    <SectionContainer color={color} padding={sectionPadding}>
      {faqs && faqs?.length > 0 && (
        <Accordion className="space-y-4" type="multiple">
          {faqs.map(faq => (
            <AccordionItem key={faq.title} value={`item-${faq._id}`}>
              <AccordionTrigger>{faq.title}</AccordionTrigger>
              <AccordionContent>
                <PortableTextRenderer value={faq.body} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </SectionContainer>
  );
}
