export default {
  name: 'artwork',
  type: 'document',
  fields: [
    {
      name: 'visible',
      type: 'boolean',
    },
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'price',
      type: 'number',
    },
    {
      name: 'artist',
      type: 'reference',
      to: [{ type: 'artist' }],
    },
    {
      name: 'image',
      type: 'image',
    },
  ],
  preview: {
    select: {
      title: 'title',
      visible: 'visible',
      price: 'price',
      artist: 'artist.name',
      media: 'image',
    },
    prepare: (selection) => {
      const { title, visible, price, artist, media } = selection
      const priceFormatted = price
        ? Intl.NumberFormat('en-gb', {
            style: 'currency',
            currency: 'GBP',
          }).format(price)
        : ''
      const subtitle = [priceFormatted, artist || '']
        .filter((part) => part)
        .join(' | ')

      return {
        title: visible ? `${title} 🟢` : `${title} ❌`,
        subtitle,
        media,
      }
    },
  },
}
