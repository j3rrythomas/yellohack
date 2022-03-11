import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { CSVLink } from 'react-csv'

const UsersTable = () => {
  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Gender', key: 'gender' },
    { label: 'Date of Birth', key: 'dob' },
    { label: 'Email', key: 'email' },
  ]

  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [selectedRows, setSelected] = useState(new Set())
  const [userCount] = useState(10)
  const [selectedData, setSelectedData] = useState([])
  const csvLinkRef = useRef()

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=' + userCount)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results)
        setUsers(data.results)
        setError('')
      })
      .catch((error) => {
        console.error(error)
        setError('Error occured during fetch')
      })
  }, [userCount])

  const handleUserSelect = (e, index) => {
    if (e.target.checked) {
      selectedRows.add(index)
    } else {
      if (selectedRows.has(index)) {
        selectedRows.delete(index)
      }
    }
    setSelected(selectedRows)
  }

  const exportUsers = () => {
    const data = users
      .filter((user, index) => selectedRows.has(index))
      .map((user) => {
        return {
          name: user.name.title + ' ' + user.name.first + ' ' + user.name.last,
          gender: user.gender[0].toUpperCase() + user.gender.substring(1),
          dob: new Date(user.dob.date).toDateString(),
          email: user.email,
        }
      })
    flushSync(() => {
      setSelectedData(data)
    })
    csvLinkRef.current.link.click()
  }

  return (
    <div className='w-full py-10'>
      <CSVLink
        data={selectedData}
        headers={headers}
        filename='UserData.csv'
        ref={csvLinkRef}
        className='hidden'
      />
      {error.length <= 0 ? (
        <>
          <h1 className='text-4xl font-semibold text-center'>Users</h1>
          <div className='flex justify-end py-5 pr-2 md:pr-8'>
            <button
              className='w-40 flex items-center justify-center bg-blue-600 hover:bg-blue-700 px-2 py-3 text-white rounded'
              onClick={exportUsers}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
              Export as CSV
            </button>
          </div>
          <div className='w-full mx-auto py-10 px-5 overflow-scroll'>
            <table className='overflow-scroll table-auto w-full divide-y divide-blue-200 border border-dashed border-blue-400'>
              <thead className='bg-gray-50 hover:bg-blue-100'>
                <tr>
                  <th className='ml-2'></th>
                  <th
                    key='name'
                    scope='col'
                    className='w-1/4 pl-3 pr-1 py-4 text-left text-sm font-medium text-gray-700 tracking-wider'
                  >
                    Name
                  </th>
                  <th
                    key='gender'
                    scope='col'
                    className='w-1/4 pl-3 pr-1 py-4 text-left text-sm font-medium text-gray-700 tracking-wider'
                  >
                    Gender
                  </th>
                  <th
                    key='dob'
                    scope='col'
                    className='w-1/4 pl-3 pr-1 py-4 text-left text-sm font-medium text-gray-700 tracking-wider'
                  >
                    DOB
                  </th>
                  <th
                    key='email'
                    scope='col'
                    className='w-1/4 pl-3 pr-1 py-4 text-left text-sm font-medium text-gray-700 tracking-wider'
                  >
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-blue-50'>
                {users.map((user, index) => (
                  <tr key={index} className='hover:bg-blue-50'>
                    <td className='pl-4'>
                      <input
                        className='cursor-pointer'
                        type='checkbox'
                        onChange={(e) => handleUserSelect(e, index)}
                      ></input>
                    </td>
                    <td className='p-4 whitespace-nowrap text-sm text-left text-black-600'>
                      {user.name.title +
                        ' ' +
                        user.name.first +
                        ' ' +
                        user.name.last}
                    </td>
                    <td className='p-4 whitespace-nowrap text-sm text-left text-black-600'>
                      {user.gender[0].toUpperCase() + user.gender.substring(1)}
                    </td>
                    <td className='p-4 whitespace-nowrap text-sm text-left text-black-600'>
                      {new Date(user.dob.date).toDateString()}
                    </td>
                    <td className='p-4 whitespace-nowrap text-sm text-left text-black-600'>
                      {user.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>{error}</div>
      )}
    </div>
  )
}

export default UsersTable
