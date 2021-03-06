// import axios from 'axios';
import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import tss from '../styles/dashboard.module.css';
import CoinCards from './CoinCards';
import SearchBar from './SearchBar';


function Dashboard({id,token,firstTimeUser,dataBaseCoins}:{id:string,token:string,firstTimeUser:boolean,dataBaseCoins:any}) {

    const [searchPlaceholder, setSearchPlaceholder] = useState('Search for stock here');
    const [selectedCoins, setSelectedCoins] = useState<string[]>(dataBaseCoins); //el estado inicial es proveido por el fetch a /getone desde servidor
    const [loaderStyle, setLoaderStyle] = useState({});
    const [showDropdown, setShowDropdown] = useState<boolean>(true);
    const [coinCount, setCoinCount] = useState(0+dataBaseCoins.length);
    const [preDashboardStyle, setPreDashboardStyle] = useState<object>({visibility:'hidden',opacity:0})

    let repeated:boolean = false;
    let navigate = useNavigate();

    useEffect(()=>{
        deactivateLoader()
    },[])

    const deactivateLoader=() =>{
        setTimeout(()=>{
            setLoaderStyle({
                visibility:'hidden',
                opacity:0,
                width:0,
                height:0
            }) 
            setPreDashboardStyle({
                visibility:'visible',
                opacity:1,
            })
         },4000)
    }

    const handleCoinSelection = (event:any) =>{

        const userSelectedCoin = event.target.dataset.value;

        selectedCoins.forEach((each:string)=>{
            if(each===userSelectedCoin){
                repeated = true;
            }
        })
        if(repeated) {
            setShowDropdown(false)
            return
        }
        if(coinCount===8){
            setShowDropdown(false)
            setSearchPlaceholder("Search here")
            return
        }
        setSelectedCoins((prevSelection:any)=>[...prevSelection,userSelectedCoin]);
        setCoinCount(coinCount+1);  
    } 


    const handleCloseCard = (event:any) => {
        const closeCard = event.currentTarget.attributes['data-value'].value;
        const filteredSelection = selectedCoins.filter((each:string)=>{
            return each !== closeCard;
        })
        setSelectedCoins(filteredSelection);
        setCoinCount(coinCount-1);
    }

    useEffect(()=>{
        console.log(selectedCoins)
    },[selectedCoins])

    const toogleShowDropdown = () =>{
        setShowDropdown(true);
    }

    const toogleRepeated = () => {
        repeated = false
    }


    const handleLogOut = async () =>{


        try{

            if(firstTimeUser){
                await fetch('https://todgerapp.herokuapp.com/todos',{
                    method:'POST',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                       _id:id,
                       coins:selectedCoins
                    })
                })
            } else {
                console.log('updating coins... ')
                fetch(`https://todgerapp.herokuapp.com/getone/${id}`,{
                    method:'POST',  
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization':token
                    },
                    body: JSON.stringify({
                        coins:selectedCoins
                     })
            })
            }
            navigate('/stock_market_app')

        }catch(error){
            console.log(error)
        }
    }

     
    return (
    <>  

        <div className={tss["loaderBg"]} style={loaderStyle}>
            <div className={tss["loader"]} >
                <div className={tss["spinner-box"]}>
                    <div className={tss["configure-border-1"]}>  
                    <div className={tss["configure-core"]}></div>
                    </div>  
                    <div className={tss["configure-border-2"]}>
                    <div className={tss["configure-core"]}></div>
                    </div> 
                </div>
            </div>
        </div>
        
        <div style={preDashboardStyle}>
            <button onClick={handleLogOut} className={tss.logout}>Log Out</button>
            <SearchBar  
                handleCoinSelection={handleCoinSelection}  
                placeholder={searchPlaceholder}
                showDropdown={showDropdown}
                toogleShowDropdown={toogleShowDropdown}
                toogleRepeated={toogleRepeated} />
            <div className="selectedCoins">
            <CoinCards 
                handleCloseCard={handleCloseCard} 
                coinCount={coinCount} 
                selectedCoins={selectedCoins}
                />
            </div>
        </div>

    </>   
    )
}

export default Dashboard