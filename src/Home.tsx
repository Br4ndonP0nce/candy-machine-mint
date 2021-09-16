import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import * as anchor from "@project-serum/anchor";
//import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

//const ConnectButton = styled(WalletDialogButton)`

//`;

//const CounterText = styled.span``; // add your styles here

//const MintContainer = styled.div``; // add your styles here

//const MintButton = styled(Button)`margin: 1em
//background-color: #008CBA;`; // add your styles here

/*
export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}
*/
//const Home = (props: HomeProps) => {
const Home = () => {
  //const [balance, setBalance] = useState<number>();
  /*
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet?.publicKey) {
        //const balance = await props.connection.getBalance(wallet?.publicKey);
        //setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        //const balance = await props.connection.getBalance(wallet.publicKey);
        //setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(() => {
    (async () => {
      if (
        !wallet ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !wallet.signTransaction
      ) {
        return;
      }

      const anchorWallet = {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction,
      } as anchor.Wallet;

      const { candyMachine, goLiveDate, itemsRemaining } =
        await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection
        );

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  }, [wallet, props.candyMachineId, props.connection]);
*/
  /*
<div className="header-2">

    <header className=" py-2 md:py-2 ">
      <div className="flex items-center justify-between py-3 px-5 md:px-10 ">

        <div className="flex items-center gap-2">
        <img className='w-20'src="/like-this.png" alt="mainIcon" />
          <a href="https://deadass.io/" className="font-bold text-xl text-indigo-600 px-5">DeadAss SOL</a>
          
          <button className="border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 md:hidden" id="navbar-toggle">
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <div className="hidden md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0" id="navbar-collapse">
          <a href="https://twitter.com/deadasssol" className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300">
          <img src="/icons/twitter-logoBlue.png" alt="" height="30" width="30"/>
          </a>
          <a href="https://discord.gg/Tc9P6JDX" className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300"><img src="/icons/discord_logo.png" alt="" height="25" width="25"/></a>
          
          
        </div>
      </div>
    </header>
    </div>


<div className="flex flex-col items-center bg-gradient-to-r from-yellow-400 to-pink-400">
  <div className="flex flex-row justify-between flex-wrap gap-5">
  <main className="mt-10 mb-6 home-container flex flex-col items-center">
    <p className="mb-4 text-2xl text-center font-bold text-black text-opacity-90">3 SOL/mint</p>
    <p className="text-lg font-bold text-black text-opacity-90 mb-4">Grab yourself a piece of dat cake</p>
    <div className="imageCointainer">
      <img src="./stronkAss.gif" alt="" width="450" className="gif" />
    </div>
    <div className= "py-20 px-20 height-40">
    {wallet.connected && (
        <div className="flex items-center">
        <p>Connected with {shortenAddress(wallet.publicKey?.toBase58() || "")}</p>
        </div>
      )}

      
      <MintContainer>
        {!wallet.connected ? (
          <ConnectButton >Connect Wallet</ConnectButton>
        ) : (
          
          <MintButton
          
            disabled={isSoldOut || isMinting || !isActive}
            onClick={onMint}
            variant="contained"
          >
            {isSoldOut ? (
              "SOLD OUT"
            ) : isActive ? (
              isMinting ? (
                <CircularProgress />
              ) : (
                "MINT"
              )
            ) : (
              <Countdown
                date={startDate}
                onMount={({ completed }) => completed && setIsActive(true)}
                onComplete={() => setIsActive(true)}
                renderer={renderCounter}
              />
            )}
          </MintButton>
          
        )}
      </MintContainer>
      </div>

</main>
<div className=" home-container flex flex-col items-center justify-center">
    <img src="/logo.png" alt="Deadass logo" width="300"/>
              
    
    
   

</div>

</div>
</div>
<section className="bg-gradient-to-r from-pink-400 to-yellow-400 h-80 flex flex-col items-center">
  <main className="mt-10 mb-6 home-container flex flex-col items-center">
<p className="text-2xl"> Check us out</p>
<p className="mt-6 text-lg"> Next best collection available on
<div className="flex flex-col items-center ">
  <img className = "mt-3"src="./de-logo.png" alt="DigitalEyes" width="219" height="40"/>
  <div className="flex items-start">
  <img className ="" src="./deadass.png" alt="" width="200" height="50" />
  </div>

</div>


</p>
</main>

</section >

<section className="Roadmap bg-red-300 h-96 flex flex-col items-center">
  <div className="box h-96 w-96 bg-black flex flex-col items-center">
  <p className="text-2xl font-bold uppercase text-white">RoadMap</p>
  </div>
  <img src="" alt="" />

</section>

<section className="Team bg-pink-300 ">
  <div className="flex flex-row justify-between flex-wrap">
  <div className="flex flex-col items-center">
  <img className ="logo-exchange mt-6 rounded-xl border white border-4" src="./like-this.png" width="150"alt="" />
  <p>Assgod</p>
  <p className="text-md mt2 font-medium text-gray-200"></p>
  </div>
  <div className="flex flex-col items-center">
  <img className ="logo-exchange mt-6 rounded-xl border white border-4" src="./like-this.png" width="150"alt="" />
  <p>Assgod</p>
  <p className="text-md mt2 font-medium text-gray-200"></p>
  </div>
  <div className="flex flex-col items-center">
  <img className ="logo-exchange mt-6 rounded-xl border white border-4" src="./like-this.png" width="150"alt="" />
  <p>Assgod</p>
  <p className="text-md mt2 font-medium text-gray-200"></p>
  </div>
  <div className="flex flex-col items-center">
  <img className ="logo-exchange mt-6 rounded-xl border white border-4" src="./like-this.png" width="150"alt="" />
  <p>Assgod</p>
  <p className="text-md mt2 font-medium text-gray-200"></p>
  </div>
  </div>
  

</section>
*/
  return (
    
      <main>
        <body className="flex items-center justify-center h-screen bg-gradient-to-b from-green-200 to-green-500" >
            <span className="flex items-center justify-center"><img src="./images/comingsoon.png" alt="Coming soon" height="120" width="500" /></span>
        </body>
      
            



    
    
        
        
        
     
      </main>
  );
};
/*
 <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};
*/

export default Home;
