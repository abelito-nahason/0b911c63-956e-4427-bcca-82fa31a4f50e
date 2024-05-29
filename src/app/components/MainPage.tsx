'use client'
import TableData from "@/src/infrastructure/api/tabledata"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import TableComponent from "./TableComponent"
import { TableDataInterface } from "@/src/model/tabledata"



const MainPage = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const tableData = new TableData()
    const [errorId, setErrorId] = useState(0)
    const [errorKey, setErrorKey] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const {data, isLoading, error, refetch} = useQuery({
        queryKey: [page, pageSize],
        queryFn: ()=> tableData.getData({page,pageSize})
    })

    const {mutate} = useMutation({
        mutationFn: (val:TableDataInterface.Request.Put)=> tableData.updateData(val),
        onError: (err:any)=> { setErrorId(parseInt(err.id)); 
                               setErrorKey(err.key)
                               setErrorMsg(err.responseMessage || '')
                            },
        onSuccess: ()=> {
            setErrorId(0)
            setErrorKey('')
            refetch()
        }
    })

    const {mutate:deleteData} = useMutation({
        mutationFn: (val:TableDataInterface.Request.Delete) => tableData.deleteData(val),
        onError: (err:any) => console.log(err),
        onSuccess: ()=> refetch()
    })

    const {mutate:addData} = useMutation({
        mutationFn: () => tableData.addData(),
        onError: (err:any) => console.log(err),
        onSuccess: ()=> refetch()
    })

    return (
        <main>
            <TableComponent
                data={data?.data || []}
                pageNumber={page}
                pageSize={pageSize}
                setPageNumber={setPage}
                onCellChange={mutate as ()=>void}
                setPageSize={setPageSize}
                totalRows={data?.totalRows || 0}
                loading={isLoading}
                errorId={errorId}
                errorKey={errorKey}
                errorMsg={errorMsg}
                deleteData={deleteData}
                addData={addData}
            />
        </main>
    )
}

export default MainPage