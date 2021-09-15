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

const ConnectButton = styled(WalletDialogButton)`

`;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)`margin: 1em
background-color: #008CBA;`; // add your styles here


export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  //const [balance, setBalance] = useState<number>();
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

  return (
    
      <main>
        
        <div className="relative bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
      <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="50,0 100,0 50,100 0,100" />
      </svg>

      <div>
        <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
            <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div className="flex items-center justify-between w-full md:w-auto">
                <a href="https://discord.gg/Tc9P6JDX">
                  <span className="sr-only">Workflow</span>
                  <img className="h-8 w-auto sm:h-10" src=""></img>
                </a>
                <div className="-mr-2 flex items-center md:hidden">
                  <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    
                    
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
              <a href="https://discord.gg/Tc9P6JDX" className="font-medium text-gray-500 hover:text-gray-900">ASS</a>

              <a href="https://discord.gg/Tc9P6JDX" className="font-medium text-gray-500 hover:text-gray-900">ASS</a>

              <a href="https://discord.gg/Tc9P6JDX" className="font-medium text-gray-500 hover:text-gray-900">ASS</a>

              <a href="https://discord.gg/Tc9P6JDX" className="font-medium text-gray-500 hover:text-gray-900">ASS</a>
              
              
              

              
            </div>
          </nav>
        </div>

       
        <div className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5 pt-4 flex items-center justify-between">
              <div>
                <img className="h-8 w-auto" src="" alt=""></img>
              </div>
              <div className="-mr-2">
                <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Close main menu</span>
                  
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Product</a>

              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Features</a>

              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Marketplace</a>

              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Company</a>
            </div>
            <a href="#" className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100">
              Log in
            </a>
          </div>
        </div>
      </div>

      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <div className="sm:text-center lg:text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">NFT cake </span>
            <span className="block text-indigo-600 xl:inline">Deadass </span>
          </h1>
          
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            The First Ass in Defi
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
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
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                Read more
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
  <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
    <img className="h-56 w-full object-cover sm:h-56 md:h-56 lg:w-full lg:h-full" src="./stronkAss.gif" alt="">
    </img>
  </div>
</div>
            <div className="header-2">

    <header className=" ">
      <div className="flex bg-blue-100 items-center justify-between py-3 px-5 md:px-10 ">

        <div className="flex items-center gap-2">
          <h1><span className="block text-indigo-600 xl:inline ">DeadAss SOL</span></h1>
          
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
      </main>
  );
};

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

export default Home;
