
export namespace TableDataInterface {
    export namespace Request {
        export interface Get {
            pageSize:number;
            page:number;
        }

        export interface Put {
            id:string;
            key:string;
            value:string;
        }

        export interface Delete {
            id:string;
        }

    }

    export namespace Response {
        export interface Get {
            data: {
                id:number;
                first_name:string;
                last_name:string;
                position:string;
                phone:string;
                email:string;
            }[];
            pageSize:number;
            pageNumber:number;
            totalRows:number;
        }

        export interface Put {
            responseCode:string;
            responseMesage:string;
        }

        export interface Delete {
            responseCode:string;
            resposneMessage:String;
        }
    }
}

