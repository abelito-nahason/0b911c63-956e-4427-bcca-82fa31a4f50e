import { TableDataInterface } from "@/src/model/tabledata"

const baseUrl = 'http://localhost:3000'

export default class TableData {
    async getData({page, pageSize}:TableDataInterface.Request.Get): Promise <TableDataInterface.Response.Get> {
        try {
            const queryParams = new URLSearchParams({page: page.toString(), pageSize: pageSize.toString()})
            const fetchTableData:unknown = (await fetch(`${baseUrl}/api/tabledata?${queryParams}`)).json()
            return fetchTableData as TableDataInterface.Response.Get
        } catch (error) {
            throw(error) 
        }
    } 

    async updateData({id, key, value}:TableDataInterface.Request.Put): Promise<void> {
        try {
            const response = await fetch(`${baseUrl}/api/tabledata`, {method: 'PUT', body: JSON.stringify({id,key,value})})
            if(response.ok) return await response.json()
            throw (await response.json())
        } catch (error:any) {
            throw(error)
        }

    }

    async deleteData({id}:TableDataInterface.Request.Delete): Promise<void> {
        try {
            const queryParams = new URLSearchParams({id: id.toString()})
            const response = await fetch(`${baseUrl}/api/tabledata?${queryParams}`, {method: 'DELETE'})
            if(response.ok) return await response.json()
            throw(await response.json())
        } catch (error) {
            throw(error)            
        }
    }

    async addData():Promise<void> {
        try {
            const response = await fetch(`${baseUrl}/api/tabledata`, {method: 'POST'})
            if(response.ok) return await response.json()
            throw(await response.json())
        } catch (error) {
            throw(error)
        }
    }
}