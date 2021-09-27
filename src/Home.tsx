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

import { useAnchorWallet } from "@solana/wallet-adapter-react";

import discordLogo from "./images/discrod.png";
import twitter from "./images/twitter.png";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div`margin`; // add your styles here

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
      <div className=" relative min-h-full py-10 flex flex-col-3 justify-center h-screen bg-purple-600">
        <img
          className=" hiddenAss absolute bottom-0 left-0 h-100 w-60"
          src={leftBottomAss}
          alt=""
          height="50%"
        />
        <img
          className=" hiddenAss absolute bottom-0 right-0 h-100 w-60"
          src={rightBottomAss}
          alt=""
          height="50%"
        />
        <div id="toMint"></div>
        <section className=" finalSection py-5 shadow-inner container border-4 flex-col justify-center flex-grow bg-green-400 h-100 ">
          <div className="  flex flex-col items-center ">
            <div className=" border-4 rounded-lg shadow-xl borc py-2 flex-col justify-left  bg-green-600 ">
              <div className=" gass flex flex-col items-center">
                <h1 className="assTitleFinal">
                  HOLD ON TIGHT TO THE GOOD THINGS IN LIFE
                </h1>
                {wallet && (
                  <p>
                    Address: {shortenAddress(wallet.publicKey.toBase58() || "")}
                  </p>
                )}
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
                <h2 className="assMapFinal">
                  ONLY Solana. NO Ass, Gas or Cash.
                </h2>
                <h2 className="assMapFinal">
                  The price increases every 2323 asses minted.
                </h2>
                <h2 className="assMapFinal">0.69</h2>
                <h2 className="assMapFinal">1.69</h2>
                <h2 className="assMapFinal">2.69</h2>

                <h3 className="dbass">
                  LAUNCHING ASSAP, JOIN US NOW FOR UPDATES
                </h3>
                <div className="flex flex-row items-center">
                  <a
                    className="anchorsSocials justify-center flex items-center"
                    href="https://discord.gg/wd5wKU8r"
                  >
                    <img className="w-1/4" src={discordLogo} alt="" />
                  </a>
                  <a
                    className="justify-center flex items-center"
                    href="https://twitter.com/deadasssol"
                  >
                    <img className=" w-1/4" src={twitter} alt="" />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex-col justify-center "></div>
            <div className=" flex-col justify-center"></div>
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
