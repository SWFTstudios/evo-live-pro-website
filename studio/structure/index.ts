import {CogIcon} from '@sanity/icons/Cog'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {FolderIcon} from '@sanity/icons/Folder'
import {ImagesIcon} from '@sanity/icons/Images'
import {PackageIcon} from '@sanity/icons/Package'
import {TagIcon} from '@sanity/icons/Tag'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

// Mirrors the old Payload dashboard sidebar: same groups, same names, same order.
const bySortOrder = [{field: 'sortOrder', direction: 'asc' as const}]

const sortedList = (S: StructureBuilder, type: string, title: string) =>
  S.documentTypeListItem(type)
    .title(title)
    .child(S.documentTypeList(type).title(title).defaultOrdering(bySortOrder))

const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title))

const inquiryList = (S: StructureBuilder, title: string, filter: string) =>
  S.listItem()
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
        .title('Inbox')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Inquiries (Form Submissions)')
            .items([
              inquiryList(S, 'New', 'status == "new"'),
              inquiryList(S, 'In progress', 'status == "in-progress"'),
              inquiryList(S, 'Quoted', 'status == "quoted"'),
              inquiryList(S, 'All inquiries', ''),
            ]),
        ),

      S.listItem()
        .title('Rentals')
        .icon(PackageIcon)
        .child(
          S.list()
            .title('Rentals')
            .items([
              S.listItem()
                .title('Equipment (Inventory)')
                .schemaType('equipment')
                .child(
                  S.list()
                    .title('Equipment (Inventory)')
                    .items([
                      S.listItem()
                        .title('All items')
                        .schemaType('equipment')
                        .child(
                          S.documentTypeList('equipment')
                            .title('All items')
                            .defaultOrdering(bySortOrder),
                        ),
                      S.listItem()
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
