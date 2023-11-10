import { useState } from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import ChangeAccountInfo from "../info-change/ChangeAccountInfo";
import { useSelector } from "react-redux";

const styleShow={display: 'flex', flexDirection: 'column', alignItems: 'center'};
const styleHide={display: 'none'};

function isLeapYear(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) return 1;
    else return 0;
}
function parseBirthday(str) {
    if(str!==null && str!==undefined && str!==""){
        const parts = str.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        return {
        day: day,
        month: month,
        year: year
        };
    }
    else return {
        day: 1,
        month: 1,
        year: 2000
    };
}
const startYear = 1940;
const endYear = 2023;
const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
const dayOfMonth = [[31,28,31,30,31,30,31,31,30,31,30,31],[31,29,31,30,31,30,31,31,30,31,30,31]];
export default function UserInformation(prop) {
    const userInfo = useSelector(state=>state.user_info)

    let userInfoBirthday=parseBirthday(userInfo.birthday);
    
    const [savedRealname, setSavedRealname] = useState(userInfo?.information?.real_name??"");
    const [savedGender, setSavedGender] = useState(userInfo?.information?.gender??"Male");
    const [savedBirthday, setSavedBirthday] = useState(userInfo?.information?.birthday??"");
    const [savedOrganization, setSavedOrganization] = useState(userInfo.information?.organization??"");

    const [dayBirth,setDayBirth] = useState(userInfoBirthday.day);
    const [monthBirth,setMonthBirth] = useState(userInfoBirthday.month);
    const [yearBirth,setYearBirth] = useState(userInfoBirthday.year);
    const [leapYear,setLeapYear] = useState(isLeapYear(userInfoBirthday.year));
    const [dayMonth,setDayMonth] = useState(dayOfMonth[isLeapYear(userInfoBirthday.year)][userInfoBirthday.month-1]);
    
    const [real_name, setRealname] = useState(userInfo?.information?.real_name??"");
    const [organization, setOrganization] = useState(userInfo?.information?.organization??"");
    const [gender, setGender] = useState(userInfo?.information?.gender??"Male");

    const [doneSubmit, setDoneSubmit] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);

    const handleSubmit = () => {
        setDoneSubmit("");
        setOpenModal(true);
        async function checkResults() {
            try {
                let collectResult={real_name,gender,birthday:`${dayBirth}/${monthBirth}/${yearBirth}`,organization};
                const response = await prop.fnUpdate(collectResult);
                if (response.success===true) {
                    setDoneSubmit(false);
                } else {
                    setDoneSubmit(undefined);
                    setOpenModal(false);
                }
            } catch (error) {
              console.error(error);
              setDoneSubmit(false);
            }
          }
          
          checkResults();
      
    };
    return  (
        <>
            <Typography variant="h5" gutterBottom>
                Personal informations
            </Typography>
            <Typography variant="h6" gutterBottom>
                - Full name: {savedRealname}
            </Typography>
            <Typography variant="h6" gutterBottom>
                - Gender: {savedGender}
            </Typography>
            <Typography variant="h6" gutterBottom>
                - Birth day: {savedBirthday}
            </Typography>
            <Typography variant="h6" gutterBottom>
                - Organization: {savedOrganization}
            </Typography>
            <ChangeAccountInfo
                buttonName="Change"
                title="Change information"
                submit={handleSubmit}
                open = {openModal===true} 
            >
                <div style={doneSubmit!==true?styleShow:styleHide}>
                    <TextField
                        disabled={doneSubmit===""}
                        sx={{margin:2, width:270}}
                        id="outlined-real-name"
                        label="Full name"
                        autoComplete="real_name"
                        value={`${real_name}`}
                        onChange={event => setRealname(event.target.value)}
                    />
                    <TextField
                        disabled={doneSubmit===""}
                        sx={{margin:2, width:270}}
                        id="gender"
                        select
                        label="Gender"
                        value={gender}
                        onChange={event=>setGender(event.target.value)}
                    >
                        <MenuItem value="Male">
                            Male
                        </MenuItem>
                        <MenuItem value="Female">
                            Female
                        </MenuItem>
                        <MenuItem value="Other">
                            Other
                        </MenuItem>
                    </TextField>
                    <Box sx={{margin:1, width:270}}>
                        <TextField
                            disabled={doneSubmit===""}
                            sx={{margin:1, width:65}}
                            id="bday-day"
                            select
                            label="Day"
                            value={`${dayBirth}`}
                            autoComplete="bday-day"
                            onChange={event=> setDayBirth(event.target.value)}
                        >
                            {Array.from({ length: dayMonth }, (_, index) => (
                                <MenuItem value={index+1} key={index+1}>
                                {index+1}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            disabled={doneSubmit===""}
                            sx={{margin:1, width:65}}
                            id="bday-month"
                            select
                            label="Month"
                            value={monthBirth}
                            autoComplete="bday-month"
                            onChange={event =>{
                                setMonthBirth(event.target.value);
                                setDayMonth(dayOfMonth[leapYear][event.target.value-1]);
                            }}
                        >
                            {Array.from({ length: 12 }, (_, index) => (
                                <MenuItem value={index+1} key={index+1}>
                                {index+1}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            disabled={doneSubmit===""}
                            sx={{margin:1, width:90}}
                            id="bday-year"
                            select
                            label="Year"
                            value={yearBirth}
                            autoComplete="bday-year"
                            onChange={event =>{
                                setYearBirth(event.target.value);
                                let newLeapYear=isLeapYear(event.target.value);
                                setLeapYear(newLeapYear);
                                setDayMonth(dayOfMonth[newLeapYear][monthBirth-1]);
                            }}
                        >
                            {years.map(year => (
                                <MenuItem value={year} key={year}>
                                {year}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField
                        disabled={doneSubmit===""}
                        sx={{margin:2, width:270}}
                        id="outlined-organization"
                        label="Organization"
                        autoComplete="organization"
                        value={`${organization}`}
                        onChange={event => setOrganization(event.target.value)}
                    />
                    <Typography sx={{display:(doneSubmit===false?"block":"none"),margin:2, width:270}} variant="caption" gutterBottom>
                        Sorry! Something went be wrong. Try again or wait a minute.
                    </Typography>
                    <Button
                        disabled={doneSubmit===""}
                        sx={{margin:2, width:270}}
                        variant="outlined"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </ChangeAccountInfo>
        </>
    );
}