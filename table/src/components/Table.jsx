/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useRowSelect, useSortBy, useTable } from 'react-table'

import useStore from '../hooks/useStore'

import Toggle from './cells/Toggle'
import SanityImage from './cells/SanityImage'
import Text from './cells/Text'
import Price from './cells/Price'
import Select from './cells/Select'
import DeleteId from './cells/DeleteId'

function Table({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Visible',
        accessor: 'visible',
        Cell: ({ row, cell }) => (
          <Toggle
            _id={row.original._id}
            _action={row.original._action || `patch`}
            field={cell.column.id}
            value={cell.value}
          />
        ),
      },
      {
        Header: 'Image',
        accessor: 'image',
        Cell: ({ row, cell }) => (
          <SanityImage
            _id={row.original._id}
            _action={row.original._action || `patch`}
            field={cell.column.id}
            value={cell.value}
          />
        ),
      },
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ row, cell }) => (
          <Text
            _id={row.original._id}
            _action={row.original._action || `patch`}
            field={cell.column.id}
            value={cell.value}
          />
        ),
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ row, cell }) => (
          <Price
            _id={row.original._id}
            _action={row.original._action || `patch`}
            field={cell.column.id}
            value={cell.value || 0}
          />
        ),
      },
      {
        Header: 'Artist',
        accessor: 'artist',
        Cell: ({ row, cell }) => (
          <Select
            _id={row.original._id}
            _action={row.original._action || `patch`}
            field={cell.column.id}
            value={cell.value?._ref}
          />
        ),
      },
      {
        Header: 'Delete',
        accessor: '_id',
        Cell: ({ row, cell }) => (
          <DeleteId _id={row.original._id} _action="delete" value={false} />
        ),
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable({ columns, data }, useSortBy, useRowSelect, (hooks) => {
    hooks.visibleColumns.push((columns) => [
      // Let's make a column for selection
      {
        id: 'selection',
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => (
          <div className="pl-2">
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      ...columns,
    ])
  })

  const setSelectedRowDocIds = useStore((state) => state.setSelectedRowDocIds)

  useEffect(() => {
    if (selectedFlatRows && selectedFlatRows.length) {
      setSelectedRowDocIds([...selectedFlatRows.map((row) => row.original._id)])
    }
  }, [selectedFlatRows, data])

  return (
    <>
      <table {...getTableProps()} className="w-full">
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="bg-purple-50 text-purple-700 p-1 pl-2 text-left text-xs font-bold"
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row)
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => (
                      // Apply the cell props
                      <td
                        {...cell.getCellProps()}
                        className={`border-b pr-2 transition-color duration-100 ease-out ${
                          selectedRowIds[row.id]
                            ? `bg-blue-50 border-blue-100`
                            : `bg-white border-gray-100`
                        }`}
                      >
                        {
                          // Render the cell contents
                          cell.render('Cell')
                        }
                      </td>
                    ))
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </>
  )
}

Table.propTypes = {
  data: PropTypes.array,
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input
          className="w-6 h-6"
          type="checkbox"
          ref={resolvedRef}
          {...rest}
        />
      </>
    )
  }
)

export default Table
