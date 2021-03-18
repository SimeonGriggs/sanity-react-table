import { v4 as uuidv4 } from 'uuid'

export function stubNewDocument() {
  return {
    _id: uuidv4(),
    _action: `create`,
    visible: false,
    title: '',
    price: '',
    artist: { _ref: '' },
  }
}
