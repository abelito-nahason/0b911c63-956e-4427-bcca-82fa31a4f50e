import { NextRequest } from 'next/server'
import data from '../../../data.json'
import { TableDataInterface } from '@/src/model/tabledata'

type DynamicKey = {[key:string]:string | number}[]

let curData:DynamicKey = data as any

type Data = typeof data
type SortKeys = keyof Data[0]

const paginate = (array:Array<any>, pageSize:number, page:number ) => {
    return array.slice((page - 1) * pageSize, page * pageSize)
}

export async function GET(req:NextRequest) {
    const searchParams = req.nextUrl.searchParams
    let queryPage = searchParams.get('page')
    let queryPageSize = searchParams.get('pageSize')
    let page = 1
    let pageSize = 10

    try {
        page = parseInt(queryPage || '1')
        pageSize = parseInt(queryPageSize || '10')
    } catch (error) {
        console.error(error)
    }

    const paginatedData = paginate(curData, pageSize, page)

    return Response.json({
        data: paginatedData,
        pageSize: pageSize,
        pageNumber: page,
        totalRows: curData.length
    })
}

export async function PUT(req:NextRequest) {
    const body:Partial<TableDataInterface.Request.Put> = await req.json()
    try {
        const findIndex = curData.findIndex((obj)=> obj.id === parseInt(body.id || ''))

        if(body.value?.replace(/ /g,'') === "") {
            return Response.json({responseCode:400, 
                                  responseMessage: 'Value should not be empty',
                                  id: body.id,
                                  key: body.key
                                },{status:400, statusText:'Bad Request'})
        } 

        if(body.key === 'email' && curData.find((obj) => obj.email === body.value)) {
            return Response.json({responseCode:400, 
                                  responseMessage: 'Email already exists',
                                  id: body.id,
                                  key: body.key
                                }, {status:400, statusText:'Bad Request'})
        } 
        
        
        curData[findIndex][body.key as string] = body.value as string
        return Response.json({
            responseCode: '200',
            responseMessage: 'update success'
        })

    } catch (error) {
        return new Response(null, {status:500, statusText: 'Internal Server Error'})
    }
}

export async function DELETE(req:NextRequest) {
    const searchParams = req.nextUrl.searchParams
    let queryPage = searchParams.get('id')
    if(!queryPage) return Response.json({responseCode:400, responseMessage: 'No Id'}, {status: 400, statusText: 'Bad Request'})
    
    const findIndex = curData.findIndex((obj)=> obj.id === parseInt(queryPage || ''))
    curData.splice(findIndex, 1)

    return Response.json({
        responseCode:200,
        responseMessage: 'Delete successful'
    })

}

export async function POST(req:NextRequest) {

    let maxValue = 0;
    for (let index = 0; index < curData.length; index++) {
        if(curData[index].id as number > maxValue) {
            maxValue = curData[index].id as number
        }            
    }

    const newObj = {
        id: maxValue + 1,
        first_name: '',
        last_name: '',
        position: '',
        phone: '',
        email: ''
    }


    for (let index = 0; index < curData.length; index++) {
        let isNew = false;
        let storeObj;
        const obj = data[index]

        for(const prop in obj){
            if(obj[prop as SortKeys] === '') isNew = true
        }

        if(isNew && index + 1 === curData.length) {
            curData.push(newObj)
            break; 
        }

        if(isNew) {
            continue
        } else {
            storeObj = curData[index]
            curData.splice(index,1,newObj)
            curData.push(storeObj)
            break
        }
    }

    return Response.json({
        responseCode:200,
        responseMessage: 'Post successful'
    })
}