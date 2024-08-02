import type { NextPage } from "next";
import { TransferEth } from "components/TransferEth";
import { ConnectWallet } from "components/ConnectWallet";
import { InvalidTxn } from "components/InvalidTxn";
import { SignMessage } from "components/SignMessage";
import { DojoSpawnAndMove } from "components/DojoSpawnAndMove";
import { DelegateAccount } from "components/DelegateAccount";

const Home: NextPage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold underline text-primary-foreground">Wallet</h2>
      <ConnectWallet />
      <DojoSpawnAndMove />
      <TransferEth />
      <DelegateAccount />
      <InvalidTxn />
      <SignMessage />
    </div>
  );
};

export default Home;
