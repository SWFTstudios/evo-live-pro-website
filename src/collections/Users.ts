import type { CollectionConfig } from 'payload'
import { adminOrSelf, isAdmin, isLoggedIn } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Accounts',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: true,
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
    read: isLoggedIn,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create' || !data) return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.role = 'admin'
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin (can manage users and settings)', value: 'admin' },
        { label: 'Editor (can edit content)', value: 'editor' },
      ],
      access: {
        create: ({ req }) => req.user?.role === 'admin' || !req.user,
        update: ({ req }) => req.user?.role === 'admin',
      },
      admin: { description: 'The very first account created is always an Admin.' },
    },
  ],
}
