export default {
  name: 'artist',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
}
