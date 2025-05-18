import { Wrapper } from '@/app/(components)/wrapper';
import { generatePageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { fetchAllSanityServices } from '../actions';

export const dynamic = 'force-static';

// Create a default service page for the /services route
const servicesIndexPage: Sanity.Services = {
  _id: 'services-index',
  _rev: '',
  _type: 'services',
  _createdAt: '',
  _updatedAt: '',
  title: 'Our Services',
  slug: { current: 'services' },
  meta_title: 'Our Services',
  meta_description: 'Explore the range of services we offer',
  noindex: false,
};

export async function generateMetadata() {
  return generatePageMetadata({ page: servicesIndexPage, slug: 'services' });
}

export default async function ServicesPage() {
  const allServices = await fetchAllSanityServices();

  return (
    <Wrapper>
      <div className="container my-16">
        <h1 className="mb-8 text-4xl font-bold">Our Services</h1>
        <p className="mb-12 text-lg">Explore the range of services we offer to meet your needs.</p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allServices && allServices.length > 0 ? (
            allServices.map(service => (
              <div key={service._id} className="rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">{service.title}</h2>
                <p className="mb-4">{service.meta_description}</p>
                <Link
                  href={`/services/${service.slug.current}`}
                  className="font-medium text-primary"
                >
                  Learn more →
                </Link>
              </div>
            ))
          ) : (
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Security Services</h2>
              <p className="mb-4">Comprehensive security solutions for your peace of mind.</p>
              <Link href="/services/security-services" className="font-medium text-primary">
                Learn more →
              </Link>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
