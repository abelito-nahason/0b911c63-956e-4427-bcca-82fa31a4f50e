import { IconType } from "react-icons"


type IconButtonType = {
    Icon:IconType
    onClick: ()=> void;
    disabled?:boolean
    className?:string;
}

const IconButton = ({Icon, onClick, disabled, className}:IconButtonType) => {

    return (
        <div className={`w-12 h-12 ${disabled ? "cursor-not-allowed" : 'hover:bg-gray-200' } rounded-full flex justify-center items-center`} onClick={disabled ? undefined : onClick}>
            <Icon className={`${disabled && 'text-gray-200'} ${className}`}/>
        </div>
    )

}

export default IconButton