import { createClient } from '@/lib/supabase/server'
import { PropertyCard } from '@/components/public/property-card'
import { DeerHead } from '@/components/icons/deer-head'
import type { Property } from '@/types/database'

export const metadata = {
  title: 'Montana Vacation Rentals | Ten Point Properties',
  description: 'Browse our collection of premium vacation rental properties in beautiful Montana.',
}

export default async function ListingsPage() {
  const supabase = await createClient()

  // Fetch public properties with typed query
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, name, address, description, photos, nightly_rate, amenities')
    .eq('is_public', true)
    .order('name') as { data: Pick<Property, 'id' | 'name' | 'address' | 'description' | 'photos' | 'nightly_rate' | 'amenities'>[] | null; error: unknown }

  if (error) {
    console.error('Error fetching properties:', error)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <DeerHead className="h-16 w-16 mx-auto mb-6 text-emerald-300" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Montana Vacation Rentals
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Escape to the mountains. Experience authentic Montana hospitality
            in our handpicked collection of vacation properties.
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Available Properties
          </h2>

          {properties && properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  name={property.name}
                  address={property.address}
                  description={property.description}
                  photos={(property.photos as string[]) || []}
                  nightly_rate={property.nightly_rate}
                  amenities={(property.amenities as string[]) || []}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <DeerHead className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No properties available yet
              </h3>
              <p className="text-slate-500">
                Check back soon for new listings!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Questions?
          </h2>
          <p className="text-slate-600 mb-6">
            Contact us at{' '}
            <a
              href="mailto:info@tenpointproperties.com"
              className="text-emerald-600 hover:underline"
            >
              info@tenpointproperties.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
