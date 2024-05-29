'use client'

import { debounce } from "../utils/debounce";

type EditableCellProps = {
    value:string;
    onChange: (value:string)=> void;
    error?:boolean;
    errorMsg?:string;
}

const EditableCell = ({value, onChange, error, errorMsg}:EditableCellProps) => {
    const debounceLog = (e:string) => {  
        onChange(e)
    }
    return (
        <td className={`relative pl-5 py-3 focus-within:border-solid focus-within:border-b-[1.5px] ${error ? 'focus-within:border-b-red-500' : 'focus-within:border-b-blue-500'}`}>
            <input type="text" onChange={debounce((e)=>debounceLog(e.target.value),500)} defaultValue={value} size={5} className="w-full focus:outline-none"/>
            { error && <div className="absolute top-11 left-0 bg-red-500 p-4 z-10 rounded-2xl">
                <p className="text-red-50">{errorMsg}</p>
            </div>}
        </td>
    )
}

export default EditableCell