import { Dispatch, SetStateAction } from "react";

const dbResponseHandler = (response: string, callback: Dispatch<SetStateAction<string>>) =>{
    switch(response){
        case 'usrCreated': callback('true')
         break;
        case 'usrAlrInDb': callback('usrAlrInDbError')
         break;
        case 'usrInfoWrong': callback('usrInfoWrong')
         break;
        default: callback('dbConnectionError')
         break;
    }
}
export default dbResponseHandler;