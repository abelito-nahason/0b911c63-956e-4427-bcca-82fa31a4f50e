'use client'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import data from '../../data.json'
import EditableCell from './EditableCell'
import { GoSortAsc, GoSortDesc } from 'react-icons/go'
import { FaArrowLeft, FaArrowRight, FaTrash } from 'react-icons/fa'
import IconButton from './IconButton'
import { IoAddOutline } from 'react-icons/io5'

type Data = typeof data
type SortKeys = keyof Data[0]

type SortDataType = {
    tableData: Data;
    sortKey: SortKeys;
    reverse:boolean;
}

type SortButtonType = {
    sortKey:SortKeys;
    columnKey:SortKeys;
    sortOrder: 'asc' | 'desc';
    onClick?: ()=> void;
}

type TableDataComponentProps = {
    data:Data;
    loading:boolean;
    totalRows:number;
    pageSize:number;
    pageNumber:number;
    setPageSize: Dispatch<SetStateAction<number>>;
    setPageNumber: Dispatch<SetStateAction<number>>;
    onCellChange: ({id,key,value}:{id:string; key:string; value:string}) => void;
    errorId:number;
    errorKey:string;
    errorMsg:string;
    deleteData: ({id}:{id:string}) => void;
    addData: ()=> void;
}

const sortData = ({tableData, sortKey, reverse}:SortDataType) => {
    if(!sortKey) return tableData

    const sortedData = tableData.sort((a,b)=>{
        return a[sortKey] > b[sortKey] ? 1 : -1;
    })

    if(reverse) {
        return sortedData.reverse()
    }
    return sortedData
}

const filterData = (data:Data) => {
    const filteredArray:Data = []
    const intactArray:Data  = []

    for (let index = 0; index < data.length; index++) {
        let isNew = false;
        const obj = data[index]
        for(const prop in obj){
            if(obj[prop as SortKeys] === '') isNew = true
        }
        if(isNew) {
            filteredArray.push(data[index])
        } else intactArray.push(data[index])
    }

    return {
        filteredArray,
        intactArray
    }
}

const SortButton = ({sortKey, columnKey, sortOrder, onClick}:SortButtonType)=> {
return (
       <div className='items-center flex' onClick={onClick}>
            {sortKey === columnKey && sortOrder === 'desc' ? <GoSortDesc/> : <GoSortAsc/> }
       </div>
    )
}


const prevPage = (pageNumber:number, setPageNumber:Dispatch<SetStateAction<number>>) => {
    if(pageNumber >= 2) {
        setPageNumber( pageNumber - 1)
    }
}

const nextPage = (maxPage:number, pageNumber:number, setPageNumber:Dispatch<SetStateAction<number>>) => {
    if((pageNumber + 1) <= maxPage) {
        setPageNumber(pageNumber + 1)
    }
}


const TableComponent = ({data, loading, totalRows, pageNumber, pageSize, setPageNumber, setPageSize, onCellChange, errorId, errorKey, errorMsg, deleteData, addData}:TableDataComponentProps) => {
    const [sortKey, setSortKey] = useState<SortKeys>('id')
    const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc')
    const maxPage = Math.ceil(totalRows / pageSize)

    console.log(errorId, errorKey)

    const changeSort = (key:SortKeys) => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        setSortKey(key)
    }

    const headers:{key:SortKeys, label:string}[] = [
        {key: 'first_name', label: 'First Name'},
        {key: 'last_name', label: 'Last Name'},
        {key: 'position', label: 'Position'},
        {key: 'phone', label: 'Phone'},
        {key: 'email', label: 'Email'},
    ]

    const sortedData = useCallback(
        ()=> {
           const {filteredArray, intactArray} = filterData(data)
           const sortedData = sortData({tableData:intactArray, sortKey, reverse:sortOrder === 'desc'})
           return {
            filteredArray,
            sortedData
           }
        //    return sortData({tableData:data, sortKey, reverse:sortOrder === 'desc'})
        }, [data, sortKey, sortOrder]
    )

    console.log('filteredArray', sortedData().filteredArray)
    console.log('intactArray', sortedData().sortedData)

    return (
        <div className="flex flex-col justify-center items-end px-32 py-5 gap-4">
            <IconButton className='text-3xl' onClick={addData} Icon={IoAddOutline}/>
            <table className='w-full border-solid border-[1.5px] border-gray-200'>
                <thead>
                    <tr className='border-solid border-[1.5px] border-gray-200'>
                        {headers.map((row) => {
                            return<td tabIndex={0} onClick={()=>changeSort(row.key)} key={row.key} className='pl-5 py-3 hover:bg-gray-200'>
                                    <div className='flex justify-between'>
                                        <p className='font-bold'>{row.label}</p>
                                        <SortButton
                                            sortKey={sortKey}
                                            columnKey={row.key}
                                            sortOrder={sortOrder}
                                        />
                                    </div>
                                </td>
                        })}
                    </tr>
                </thead>
                
                <tbody>

                {sortedData().filteredArray.map((person)=> {
                    return <tr key={person.id} className='border-solid border-[1.5px] border-gray-200'>
                                {headers.map((obj) => {
                                    return <EditableCell
                                            error={person.id === errorId && errorKey === obj.key}
                                            onChange={(value)=> onCellChange({id:person.id.toString(), key: obj.key, value: value || ''})}
                                            value={person[obj.key] as string}
                                            errorMsg={errorMsg}
                                    />
                                })}
                                <IconButton Icon={FaTrash} onClick={()=>deleteData({id:person.id.toString()})} className='text-red-500' />
                        </tr>
                })}

                {sortedData().sortedData.map((person)=> {
                    return <tr key={person.id} className='border-solid border-[1.5px] border-gray-200'>
                                {headers.map((obj) => {
                                    return <EditableCell
                                            error={person.id === errorId && errorKey === obj.key}
                                            onChange={(value)=> onCellChange({id:person.id.toString(), key: obj.key, value: value || ''})}
                                            value={person[obj.key] as string}
                                            errorMsg={errorMsg}
                                    />
                                })}
                                <IconButton Icon={FaTrash} onClick={()=>deleteData({id:person.id.toString()})} className='text-red-500' />
                        </tr>
                })}
                </tbody>
            </table>
            <div className='flex-row flex gap-4 items-center'>
                <IconButton disabled={pageNumber === 1} Icon={FaArrowLeft} onClick={()=>prevPage(pageNumber, setPageNumber)} />
                <p>{pageNumber}</p>
                <IconButton disabled={pageNumber === maxPage} Icon={FaArrowRight} onClick={()=>nextPage(maxPage,pageNumber,setPageNumber)} />
            </div>
        </div>
    )
}

export default TableComponent