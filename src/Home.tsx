import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import * as anchor from "@project-serum/anchor";
//import { LAMPORTS_PER_SOL } from "@solana/web3.js";
//import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import leftBottomAss from "./images/left_bottom_ass.png";
import rightBottomAss from "./images/right_bottom_ass.png";
import backAss from "./assets/hero.png";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { Header } from "./Components/header";
import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)`
  color: white !important;
  height: 40px !important;
  width: auto !important;
  background-color: #34d399 !important;
  font-size: 2rem !important;
  padding: 1.5rem 3.5rem !important;
  font-weight: 600 !important;
  box-shadow: 3px 3px 0 white !important;
  transition: 0.5s !important;
  border: 2px dashed white !important;
  &:hover {
    box-shadow: 0 0 0 white !important;
    transform: translate(3px, 3px) !important;
  }
`;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div`margin`; // add your styles here

const MintButton = styled(Button)`
  color: white !important;
  background-color: #34d399 !important;
  font-size: 2rem !important;
  padding: 1.5rem 3.5rem !important;
  font-weight: 600 !important;
  box-shadow: 3px 3px 0 white !important;
  transition: 0.5s !important;
  border: 2px dashed white !important;
  &:hover {
    box-shadow: 0 0 0 white !important;
    transform: translate(3px, 3px) !important;
  }
`; // add your styles here

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
  const [remItems, setRemaining] = useState<number>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
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
      if (wallet) {
        //const balance = await props.connection.getBalance(wallet?.publicKey);
        //setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        //const balance = await props.connection.getBalance(wallet.publicKey);
        //setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(() => {
    (async () => {
      if (!wallet) {
        return;
      }

      const { candyMachine, goLiveDate, itemsRemaining } =
        await getCandyMachineState(
          wallet as anchor.Wallet,
          props.candyMachineId,
          props.connection
        );

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
      setRemaining(itemsRemaining);
    })();
  }, [wallet, props.candyMachineId, props.connection]);

  return (
    <main>
      <Header />

      <div className="mainContainer relative min-h-full py-10 flex flex-col-3 justify-center h-screen bg-purple-600">
        <img className="backgroundAss" src={backAss} alt="hero" />
        <button
          onClick={async () => {
            const { itemsRemaining } = await getCandyMachineState(
              wallet as anchor.Wallet,
              props.candyMachineId,
              props.connection
            );
            setRemaining(itemsRemaining);
          }}
        >
          <img
            className=" hiddenAss absolute bottom-0 left-0 h-100 w-60"
            src={leftBottomAss}
            alt=""
            height="50%"
          />
        </button>
        <button
          onClick={() => {
            console.log(remItems);
          }}
        >
          <img
            className=" hiddenAss absolute bottom-0 right-0 h-100 w-60"
            src={rightBottomAss}
            alt=""
            height="50%"
          />
        </button>
        <div id="toMint"></div>
        <section className=" finalSection py-5  container flex-col justify-center flex-grow bg-transparent h-100  ">
          <div className="  flex flex-col items-center ">
            <div className="  rounded-lg  borc py-2 flex-col justify-left  bg-transparent-600 ">
              <div className=" gass flex flex-col items-center gap-5">
                <h1 className="assTitleFinal">
                  HOLD ON TIGHT TO THE GOOD THINGS IN LIFE
                </h1>
                {wallet && (
                  <p>
                    Address: {shortenAddress(wallet.publicKey.toBase58() || "")}
                  </p>
                )}

                <h2 className="assMapFinal">
                  ONLY Solana. NO Ass, Gas or Cash.
                </h2>
                <h2 className="greenText">The price per mint is:</h2>
                <h2 className="greenText">0.69</h2>

                <h2 className="goBack">Asses remaining = {remItems} </h2>
                <MintContainer>
                  {!wallet ? (
                    <ConnectButton>Connect Wallet</ConnectButton>
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
                          onMount={({ completed }) =>
                            completed && setIsActive(true)
                          }
                          onComplete={() => setIsActive(true)}
                          renderer={renderCounter}
                        />
                      )}

                      {console.log(remItems)}
                    </MintButton>
                  )}
                </MintContainer>
              </div>
            </div>
          </div>
        </section>
      </div>

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
