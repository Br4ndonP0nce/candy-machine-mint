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
import croppedAss from "./images/centre ass cropped.png";
import oneAss from "./images/ASSES/18.png";
import twAss from "./images/ASSES/201.png";
import trAss from "./images/ASSES/178.png";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import titanAss from "./images/ASSES/SpecialAsses/Titan Ass.png";
import msCaptain from "./images/ASSES/SpecialAsses/Mrs. Captain Ass.png";
import giraffe from "./images/ASSES/SpecialAsses/Giraffe Ass.png";
import camo from "./images/ASSES/SpecialAsses/Camo Ass.png";
import blue from "./images/ASSES/SpecialAsses/Blue Ass.png";
import kong from "./images/ASSES/SpecialAsses/Kong Ass.png";
import money from "./images/ASSES/SpecialAsses/Money Ass.png";
import biker from "./images/ASSES/SpecialAsses/Biker Ass.png";

import yellow from "./images/ASSES/SpecialAsses/Yellow Ass.png";

import superAss from "./images/ASSES/SpecialAsses/Super Ass.png";

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
    })();
  }, [wallet, props.candyMachineId, props.connection]);

  return (
    <main>
      <div className=" relative min-h-full py-10 flex flex-col-3 justify-center h-screen bg-purple-600">
        <div className="flex flex-col items-center">
          <div className="mb-8 relative container border-4 flex-col justify-center flex-grow bg-green-400">
            <div className="flex flex-col items-center ">
              <img
                className="deadassLogo object-contain w-1/4 "
                src="./images/deadass typeface.png"
                alt=""
              />
              <img
                className="croppedAss object-contain w-1/5"
                src={croppedAss}
                alt=""
              />

              <div className=" py-10 flex-col   bg-green-400 ">
                <div className="intro flex flex-col items-center">
                  <h1>The original Auto Generated Ass NFTs Project</h1>
                  <h2>6969 Unique Asses in total</h2>
                  <div className="flex-col justify-center ">
                    <a href="#toMint">
                      <button className="gotoMint rounded-full py-3 px-6 bg-yellow-300 shadow-2xl hover:bg-red-700 w-80">
                        MINT DEAD ASS!
                      </button>
                    </a>
                  </div>
                  <div className=" flex-row justify-center"></div>
                  <section className="flex items-center pt-8 px-4 w-1/3">
                    <div className="flex flex-wrap mx-4">
                      <div className="md:w-1/3 px-4 mb-8">
                        <img
                          className="rounded shadow-md"
                          src={oneAss}
                          alt=""
                        />
                        <h1 className="pictureText">GRAB</h1>
                      </div>
                      <div className="md:w-1/3 px-4 mb-8">
                        <img className="rounded shadow-md" src={twAss} alt="" />
                        <h1 className="pictureText">YOUR</h1>
                      </div>
                      <div className="md:w-1/3 px-4 mb-8">
                        <img
                          className=" rounded shadow-md"
                          src={trAss}
                          alt=""
                        />
                        <h1 className="pictureText">ASS</h1>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <img
            className=" absolute top-0 left-0 h-100 w-60"
            src="./images/left_ass_top.png"
            alt=""
            height="50%"
          />
        </div>

        <div className="">
          <img
            className="absolute top-0 right-0 h-100 w-60"
            src="./images/right_ass_top.png"
            alt=""
          />
        </div>
      </div>
      <div className="  h-full lg:py-10 md:py-20 sm:py-400 flex flex-col-3 justify-center h-screen bg-purple-600">
        <section className=" shadow-inner container border-4 flex-col justify-center  bg-green-400 h-100 ">
          <div className=" lg:py-10 flex flex-col items-center ">
            <div className=" xl:my-2 rounded-lg shadow-xl borc py-2 flex-col justify-left  bg-green-600 ">
              <div className=" px-5 assMap flex flex-col xl:gap-4 md: gap-2 ">
                <h1 className="assTitle">ASSMAP!</h1>
                <h1>Phase 1: Build team and get to work</h1>
                <h2>
                  Phase 2: Complete and deploy 6969 unique ASSets on solana
                  Mainnet
                </h2>
                <h3>Phase 3: Things to come after launch</h3>
                <div className=" toDo flex flex-col margin-right-0">
                  <ul>
                    <li>
                      - Mixtape with songs from relevant artists, endorsing Dead
                      Ass and Solana NFTs
                    </li>
                    <li>- 8-bit Dead Ass Game</li>
                    <li>- Community Contests and Rewards</li>
                    <li>
                      - minimum 1 high quality Music Video w relevant artists
                    </li>
                    <li>- Collabs with adult entertainers</li>
                    <li>- IRL AssWear (Panties, yoga shorts, boxers/briefs)</li>
                  </ul>
                </div>
                <h4>Phase 4: DEAD ASS EVERYWHERE </h4>
              </div>
            </div>
            <div className="flex-col justify-center "></div>
            <div className=" flex-col justify-center"></div>
          </div>
        </section>
      </div>
      <div className=" bg-transparent overflow-hidden">
        <div className="py-10 relative rainbow">
          <section className="slider flex items-center justify-center w-full ">
            <div className="md:w-1/5 py-4 mb-8 flex justify-center ">
              <img className="zoom1 rounded shadow-md" src={kong} alt="" />
            </div>
            <div className=" zoom1 md:w-1/5 px-4 mb-8">
              <img className="rounded shadow-md" src={msCaptain} alt="" />
            </div>
            <div className=" zoom1 md:w-1/5 py-4 mb-8">
              <img className="rounded shadow-md" src={giraffe} alt="" />
            </div>
            <div className="md:w-1/5 px-4 mb-8 flex justify-center ">
              <img className="zoom1 rounded shadow-md" src={blue} alt="" />
            </div>
            <div className=" zoom1  md:w-1/5 px-4 mb-8">
              <img className="rounded shadow-md" src={camo} alt="" />
            </div>
            <div className=" zoom1 md:w-1/5 py-4 mb-8">
              <img className="rounded shadow-md" src={titanAss} alt="" />
            </div>
            <div className=" zoom1  md:w-1/5 px-4 mb-8">
              <img className="rounded shadow-md" src={money} alt="" />
            </div>
            <div className=" zoom1 md:w-1/5 py-4 mb-8">
              <img className="rounded shadow-md" src={superAss} alt="" />
            </div>
            <div className="md:w-1/5 px-4 mb-8 flex justify-center ">
              <img className="zoom1 rounded shadow-md" src={yellow} alt="" />
            </div>
            <div className=" zoom1  md:w-1/5 px-4 mb-8">
              <img className="rounded shadow-md" src={biker} alt="" />
            </div>
          </section>
        </div>
      </div>
      <div className=" relative min-h-full py-10 flex flex-col-3 justify-center h-screen bg-purple-600">
        <img
          className=" absolute bottom-0 left-0 h-100 w-60"
          src={leftBottomAss}
          alt=""
          height="50%"
        />
        <img
          className=" absolute bottom-0 right-0 h-100 w-60"
          src={rightBottomAss}
          alt=""
          height="50%"
        />

        <section className=" shadow-inner container border-4 flex-col justify-center flex-grow bg-green-400 h-100 ">
          <div className=" py-10 flex flex-col items-center ">
            <div className=" border-4 lg:px-60 py-100 md: px-0 py-10 rounded-lg shadow-xl borc py-2 flex-col justify-left  bg-green-600 ">
              <div className="px-5 gass flex flex-col items-center lg:gap-10 md: gap-5 ">
                <h1 className="assTitle">GRAB YOURSELF A PIECE OF DAT CAKE</h1>
                <h2 className="assMap" id="toMint">
                  3 SOL / MINT
                </h2>
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
                    </MintButton>
                  )}
                </MintContainer>
                <h3 className="dbass">DON'T BE AN ASS, GET DEAD ASS</h3>
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
