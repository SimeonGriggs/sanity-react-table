/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types'
import React from 'react'
import { useRowSelect, useSortBy, useTable } from 'react-table'
import { format } from 'date-fns'

import Toggle from './Toggle'

function Table({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Published',
        accessor: 'published',
        Cell: ({ row, cell, selectedFlatRows }) => (
          <Toggle
            _id={row.original._id}
            field={cell.column.id}
            checked={cell.value}
            selectedIds={selectedFlatRows.map((row) => row.original._id)}
          />
        ),
      },
      {
        Header: 'Begins',
        accessor: 'beginAt',
        Cell: ({ cell }) => (
          <span className="font-mono text-sm">
            {format(new Date(cell.value), 'dd/MM/yyyy')}
          </span>
        ),
      },
      {
        Header: 'Ends',
        accessor: 'endAt',
        Cell: ({ cell }) => (
          <span className="font-mono text-sm">
            {format(new Date(cell.value), 'dd/MM/yyyy')}
          </span>
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
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      ...columns,
    ])
  })

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
                      className="bg-orange-50 p-2 text-left text-xs font-bold"
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
                        className={`p-2 border-b transition-color duration-100 ease-out ${
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
