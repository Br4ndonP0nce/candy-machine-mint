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
import croppedAss from "./images/Deadass_one_ass_trimmed.png";

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
import yoga from "././images/ASSES/SpecialAsses/Yoga Ass.png";
import inv from "././images/ASSES/SpecialAsses/Invisible Ass.png";
import monroe from "././images/ASSES/SpecialAsses/Monroe Ass.png";
import pat from "././images/ASSES/SpecialAsses/Star Ass.png";
import wrestling from "././images/ASSES/SpecialAsses/Wrestling Ass.png";
import flat from "././images/ASSES/SpecialAsses/World's Flattest Ass.png";
import discordLogo from "./images/discrod.png";
import twitter from "./images/twitter.png";
import gif1 from "./images/Gifs/gif 1.gif";
import gif2 from "./images/Gifs/gif 2.gif";
import gif3 from "./images/Gifs/gif 3.gif";
import gif4 from "./images/Gifs/gif 4.gif";
import gif5 from "./images/Gifs/gif 5.gif";
import gif6 from "./images/Gifs/gif 6.gif";
import gif7 from "./images/Gifs/gif 7.gif";
import gif8 from "./images/Gifs/gif 8.gif";
import gif9 from "./images/Gifs/gif 9.gif";
import gif10 from "./images/Gifs/gif 10.gif";
import gif11 from "./images/Gifs/gif 11.gif";
import gif12 from "./images/Gifs/gif special.gif";

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
                className="mb-10 deadassLogo object-contain w-1/2 "
                src={croppedAss}
                alt=""
              />

              <div className="flex-col   bg-green-400 ">
                <div className="intro flex flex-col items-center">
                  <h1>The original Auto Generated Ass NFTs Project</h1>
                  <h2 className="numberColor">6969 Unique Asses in total</h2>
                  <div className="mb-2 flex-col justify-center ">
                    <a href="#toMint">
                      <button className=" gotoMint rounded-full py-3 px-6 bg-yellow-300 shadow-2xl hover:bg-red-700 w-80">
                        MINT DEAD ASS!
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <img
            className="hiddenAss absolute top-0 left-0 h-100 w-60"
            src="./images/left_ass_top.png"
            alt=""
            height="50%"
          />
        </div>

        <div className="">
          <img
            className="hiddenAss absolute top-0 right-0 h-100 w-60 sm:h-50"
            src="./images/right_ass_top.png"
            alt=""
          />
        </div>
      </div>
      <div className="  h-full lg:py-10 md:py-20 sm:py-400 flex flex-col-3 justify-center h-screen bg-purple-600">
        <section className=" shadow-inner container border-4 flex-col justify-center items-center bg-green-400 h-100 ">
          <div className=" mt-5  gap-5  lg:py-5 flex flex-row justify-center ">
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif1}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity">Common</h1>
            </div>
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif2}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity">Uncommon</h1>
            </div>
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif3}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg "
              />
              <h1 className="Assrarity">Uncommon+1</h1>
            </div>
          </div>
          <div className=" gap-5  lg: flex flex-row justify-center ">
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif4}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity"> Rare</h1>
            </div>
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif5}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity">Very Rare</h1>
            </div>
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif6}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity">Super Rare</h1>
            </div>
          </div>
          <div className=" gap-5  py-5 lg: flex flex-row justify-center ">
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif7}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity">Ultra Rare</h1>
            </div>
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif8}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity">Epic</h1>
            </div>
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif9}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity">Legend</h1>
            </div>
          </div>
        </section>
      </div>
      <div className="  h-full lg:py-10 md:py-20 sm:py-400 flex flex-col-3 justify-center h-screen bg-purple-600">
        <section className=" shadow-inner container border-4 flex-col justify-center items-center bg-green-400 h-100 ">
          <div className=" mt-10  gap-40  lg:py-5 flex flex-row justify-center ">
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif10}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity">DeadAss Rare</h1>
            </div>
            <div className=" flex flex-col justify-center items-center ">
              <img
                src={gif11}
                alt=""
                className="pictureRow w-40 h-40 rounded-lg"
              />
              <h1 className="Assrarity ">DeadAss Legendary</h1>
            </div>
          </div>
          <div className=" mt-2  lg: flex flex-col justify-center items-center">
            <img src={gif12} alt="" className="specialAsses rounded-lg" />
            <h1 className="Assrarity ">Custom Legendary</h1>
          </div>
        </section>
      </div>
      <div className="  h-full lg:py-10 md:py-20 sm:py-400 flex flex-col-3 justify-center h-screen bg-purple-600">
        <section className=" shadow-inner container border-4 flex-col justify-center  bg-green-400 h-100 ">
          <div className="  flex flex-col items-center ">
            <div className=" assmapCont mt-10  rounded-lg shadow-xl borc py-2 flex-col justify-left  bg-green-600 ">
              <div className=" px-5 assMap flex flex-col  ">
                <h1 className="assTitle">ASSMAP!</h1>
                <h1>Phase 1: Build team and get to work</h1>
                <h2>
                  Phase 2: Complete and deploy 6969 unique ASSets on solana
                  Mainnet
                </h2>
                <h3>Phase 3: Community</h3>
                <div className=" toDo flex flex-col margin-right-0">
                  <ul>
                    <li>- Build a collective of fun and humorous people</li>
                    <li>
                      - Arrange Interactive Community Contests, Rewards, and
                      Entertainment
                    </li>
                    <li>
                      - 10% of all royalties go towards Community Wallet,
                      utilization determined by Community
                    </li>
                  </ul>
                </div>
                <h4>Phase 4: Develop the Deadass brand </h4>
                <div className=" toDo flex flex-col margin-right-0">
                  <ul>
                    <li>-Create IRL Asswear (ie. actual physical underwear)</li>
                    <li>- Create a mixtape with songs from relevant artists</li>
                    <li>
                      - Deadass short film, featuring some of our fav asses
                    </li>

                    <li>
                      - Collaborations with other Artists and Entertainers
                    </li>
                    <li>Partnerships with other awesome SOL projects </li>
                    <li>Orchestrate/Participate in Charitable ventures</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex-col justify-center "></div>
            <div className=" flex-col justify-center"></div>
          </div>
        </section>
      </div>
      <div className=" belowAssmap bg-transparent overflow-hidden">
        <div className="py-10 relative rainbow">
          <section className="slider flex items-center justify-center w-full ">
            <div className=" md:w-1/5   ">
              <img
                className=" sliderPic zoom1 rounded shadow-md"
                src={kong}
                alt=""
              />
            </div>
            <div className="  zoom1 md:w-1/5 ">
              <img
                className="sliderPic rounded shadow-md"
                src={msCaptain}
                alt=""
              />
            </div>
            <div className="  zoom1 md:w-1/5  ">
              <img
                className="sliderPic rounded shadow-md"
                src={giraffe}
                alt=""
              />
            </div>
            <div className="sliderPic md:w-1/5   ">
              <img className="zoom1 rounded shadow-md" src={blue} alt="" />
            </div>
            <div className="sliderPic  zoom1 md:w-1/5 ">
              <img className="rounded shadow-md" src={camo} alt="" />
            </div>
            <div className=" sliderPic zoom1 md:w-1/5  ">
              <img className="rounded shadow-md" src={titanAss} alt="" />
            </div>
            <div className="sliderPic zoom1  md:w-1/5  ">
              <img className="rounded shadow-md" src={money} alt="" />
            </div>
            <div className="sliderPic zoom1 md:w-1/5  ">
              <img className="rounded shadow-md" src={superAss} alt="" />
            </div>
            <div className="sliderPic md:w-1/5   ">
              <img className="zoom1 rounded shadow-md" src={yoga} alt="" />
            </div>
            <div className="sliderPic zoom1  md:w-1/5  ">
              <img className="rounded shadow-md" src={inv} alt="" />
            </div>
            <div className="sliderPic md:w-1/5   ">
              <img className="zoom1 rounded shadow-md" src={monroe} alt="" />
            </div>
            <div className="sliderPic  zoom1  md:w-1/5  m">
              <img className="rounded shadow-md" src={pat} alt="" />
            </div>
            <div className="sliderPic md:w-1/5    ">
              <img className="zoom1 rounded shadow-md" src={wrestling} alt="" />
            </div>
            <div className="sliderPic  zoom1  md:w-1/5  ">
              <img className="rounded shadow-md" src={flat} alt="" />
            </div>
            <div className="sliderPic md:w-1/5    ">
              <img className="zoom1 rounded shadow-md" src={biker} alt="" />
            </div>
            <div className=" sliderPic zoom1  md:w-1/5  ">
              <img className="rounded shadow-md" src={yellow} alt="" />
            </div>
          </section>
        </div>
      </div>
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

        <section className=" finalSection shadow-inner container border-4 flex-col justify-center flex-grow bg-green-400 h-100 ">
          <div className=" py-10 flex flex-col items-center ">
            <div className=" border-4 lg:px-60 py-100 md: px-0 py-10 rounded-lg shadow-xl borc py-2 flex-col justify-left  bg-green-600 ">
              <div className="px-5 gass flex flex-col items-center lg:gap-10 md: gap-5 ">
                <h1 className="assTitle">GRAB YOURSELF A PIECE OF DAT CAKE</h1>
                <h2 className="assMap" id="toMint">
                  EARLY MINTERS (first 2300) 0.69/MINT
                </h2>
                <h2 className="assMap" id="toMint">
                  1.69 FIRST ROUND
                </h2>
                <h2 className="assMap" id="toMint">
                  2.69 FINAL BATCH
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
                <h3 className="dbass">PREMINT LAUNCHING SOON JOIN US</h3>
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
