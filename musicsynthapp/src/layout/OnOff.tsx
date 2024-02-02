import { useEffect, useState } from "react"
import "./OnOff.scss"

type OnOffProps={
    value?:boolean,
    onChange?:(newValue:boolean)=>void
}

const OnOff = (props:OnOffProps) => {
    
    const [value, setValue] = useState(props.value??false)

    const handleChange = (e:any)=>{
        e.preventDefault();
        setValue(e.target.checked)
    }

    useEffect(()=>{
        if(props.onChange){
            props.onChange(value);
        }
    },[value])

    
    return <div className="toggle-group" onClick={()=>setValue(!value)}>
         <input type="checkbox" name="on-off-switch" id="on-off-switch" checked={value} onChange={handleChange}  ></input>
        <div className="onoffswitch pull-right" aria-hidden="true">
            <div className="onoffswitch-label">
                <div className="onoffswitch-inner"></div>
                <div className="onoffswitch-switch"></div>
            </div>
        </div>
    </div>
}
export default OnOff;