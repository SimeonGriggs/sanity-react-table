import create from 'zustand'

function isEmptyObject(obj) {
  // Object is truly empty
  if (obj && obj.constructor === Object && Object.keys(obj).length === 0) {
    return true
  }

  // Object only has the _action key left, it's as good as empty
  if (
    obj &&
    obj.constructor === Object &&
    Object.keys(obj).length === 1 &&
    // eslint-disable-next-line no-prototype-builtins
    obj.hasOwnProperty(`_action`)
  ) {
    return true
  }

  return false
}

const useStore = create((set, get) => ({
  // Local state
  artists: [],
  setArtists: (artists) =>
    set((state) => {
      state.artists = artists
    }),

  // Extend the initial React Query data
  extendedData: [],
  setExtendedData: (data) => set((state) => (state.extendedData = [...data])),
  appendToExtendedData: (data) =>
    set((state) => (state.extendedData = [...state.extendedData, ...data])),

  // Used to bulk-edit rows
  selectedRowDocIds: [],
  setSelectedRowDocIds: (ids) =>
    set((state) => (state.selectedRowDocIds = ids)),

  // Transaction data
  updates: {},
  addUpdate: (update) => {
    const newUpdates = { ...get().updates }
    const selectedIds = get().selectedRowDocIds
    const updateIds =
      selectedIds.length && selectedIds.includes(update._id)
        ? selectedIds
        : [update._id]

    updateIds.forEach((_id) => {
      newUpdates[_id] = {
        ...newUpdates[_id],
        _action: update._action,
        [update.key]: update.value,
      }
    })

    set((state) => (state.updates = newUpdates))
  },
  removeUpdate: (update) => {
    const newUpdates = { ...get().updates }
    const selectedIds = get().selectedRowDocIds
    const updateIds =
      selectedIds.length && selectedIds.includes(update._id)
        ? selectedIds
        : [update._id]

    updateIds.forEach((_id) => {
      // Remove this just this key
      // eslint-disable-next-line no-prototype-builtins
      if (newUpdates[_id] && newUpdates[_id].hasOwnProperty(update.key)) {
        delete newUpdates[_id][update.key]
      }

      // Remove this _id, if now empty
      if (isEmptyObject(newUpdates[_id])) {
        delete newUpdates[_id]
      }
    })

    if (isEmptyObject(newUpdates)) {
      set((state) => (state.updates = {}))
    } else {
      set((state) => (state.updates = newUpdates))
    }
  },
  reset: () =>
    set((state) => {
      state.updates = {}
      state.selectedRowDocIds = []
    }),
}))

export default useStore
