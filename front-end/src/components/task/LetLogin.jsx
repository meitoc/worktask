import { useContext } from 'react';
import { ContextStatus } from '../../App';
import { ButtonBase } from '@mui/material';
export default function LetLogin () {
    const {setShowLoginForm} = useContext(ContextStatus)
    return(
        <ButtonBase style={{  width:"100%"}} onClick={()=>setShowLoginForm(true)}>
            <img
                style={{ width:"100%"}}
                src={"/let-log-in.svg"}>
            </img>
        </ButtonBase>
    )
}