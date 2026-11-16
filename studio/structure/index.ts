import {CogIcon} from '@sanity/icons/Cog'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {FolderIcon} from '@sanity/icons/Folder'
import {ImagesIcon} from '@sanity/icons/Images'
import {PackageIcon} from '@sanity/icons/Package'
import {TagIcon} from '@sanity/icons/Tag'
import {HomeIcon} from '@sanity/icons/Home'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {Overview} from '../components/Overview'

// Mirrors the old Payload dashboard sidebar: same groups, same names, same order.
const bySortOrder = [{field: 'sortOrder', direction: 'asc' as const}]

const sortedList = (S: StructureBuilder, type: string, title: string) =>
  S.documentTypeListItem(type)
    .title(title)
    .child(S.documentTypeList(type).title(title).defaultOrdering(bySortOrder))

const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title))

const inquiryList = (S: StructureBuilder, id: string, title: string, filter: string) =>
  S.listItem()
    .id(id)
    .title(title)
    .schemaType('inquiry')
    .child(
      S.documentList()
        .title(title)
        .schemaType('inquiry')
        .filter(`_type == "inquiry"${filter ? ` && ${filter}` : ''}`)
        .defaultOrdering([{field: 'submittedAt', direction: 'desc'}]),
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Evo Live Pro CMS')
    .items([
      S.listItem()
        .id('overview')
        .title('Overview')
        .icon(HomeIcon)
        .child(S.component(Overview).id('overview-pane').title('Overview')),
      S.divider(),
      S.listItem()
        .id('inbox')
        .title('Inbox')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Inquiries (Form Submissions)')
            .items([
              inquiryList(S, 'new', 'New', 'status == "new"'),
              inquiryList(S, 'in-progress', 'In progress', 'status == "in-progress"'),
              inquiryList(S, 'quoted', 'Quoted', 'status == "quoted"'),
              inquiryList(S, 'all', 'All inquiries', ''),
            ]),
        ),

      S.listItem()
        .id('rentals')
        .title('Rentals')
        .icon(PackageIcon)
        .child(
          S.list()
            .title('Rentals')
            .items([
              S.listItem()
                .id('equipment')
                .title('Equipment (Inventory)')
                .schemaType('equipment')
                .child(
                  S.list()
                    .title('Equipment (Inventory)')
                    .items([
                      S.listItem()
                        .id('all')
                        .title('All items')
                        .schemaType('equipment')
                        .child(
                          S.documentTypeList('equipment')
                            .title('All items')
                            .defaultOrdering(bySortOrder),
                        ),
                      S.listItem()
                        .id('by-category')
                        .title('By category')
                        .child(
                          S.documentTypeList('equipmentCategory')
                            .title('By category')
                            .defaultOrdering(bySortOrder)
                            .child((categoryId) =>
                              S.documentList()
                                .title('Equipment')
                                .schemaType('equipment')
                                .filter('_type == "equipment" && category._ref == $categoryId')
                                .params({categoryId})
                                .defaultOrdering(bySortOrder),
                            ),
                        ),
                      S.listItem()
                        .id('hidden')
                        .title('Hidden items')
                        .schemaType('equipment')
                        .child(
                          S.documentList()
                            .title('Hidden items')
                            .schemaType('equipment')
                            .filter('_type == "equipment" && available == false')
                            .defaultOrdering(bySortOrder),
                        ),
                    ]),
                ),
              sortedList(S, 'equipmentCategory', 'Equipment Categories'),
              sortedList(S, 'rentalPackage', 'Sound + DJ Packages'),
            ]),
        ),

      S.listItem()
        .id('events-pricing')
        .title('Events & Pricing')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Events & Pricing')
            .items([
              sortedList(S, 'weddingPackage', 'Wedding Packages'),
              sortedList(S, 'alaCarteItem', 'À la carte Pricing'),
            ]),
        ),

      S.listItem()
        .id('pages')
        .title('Pages & Content')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Pages & Content')
            .items([
              singleton(S, 'siteSettings', 'Site Settings'),
              singleton(S, 'homePage', 'Home Page'),
              singleton(S, 'aboutPage', 'About Page'),
              singleton(S, 'eventsPage', 'Events Page'),
              singleton(S, 'contactPage', 'Contact Page'),
              S.divider(),
              sortedList(S, 'eventService', 'Event Services'),
              sortedList(S, 'teamMember', 'Team'),
              sortedList(S, 'brand', 'Brands We Produced For'),
              sortedList(S, 'venue', 'Venues We Know'),
              sortedList(S, 'testimonial', 'Testimonials'),
              sortedList(S, 'faq', 'FAQs'),
            ]),
        ),

      S.listItem()
        .id('library')
        .title('Library')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Library')
            .items([
              S.documentTypeListItem('galleryItem')
                .title('Photos & Videos')
                .icon(ImagesIcon)
                .child(
                  S.documentTypeList('galleryItem')
                    .title('Photos & Videos')
                    .defaultOrdering(bySortOrder),
                ),
            ]),
        ),
    ])
