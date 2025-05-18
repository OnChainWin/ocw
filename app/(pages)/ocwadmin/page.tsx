"use client";
import {
  A_PAIDTIMER_CONTRACT_ABI,
  A_PAIDTIMER_CONTRACT_ADDRESS,
  FREE3_CONTRACT_ABI,
  FREE3_CONTRACT_ADDRESS,
  FREEOCW_CONTRACT_ABI,
  FREEOCW_CONTRACT_ADDRESS,
  TOKEN_PAIDTIMER_CONTRACT_ABI,
  TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
} from "@/constants/contract";
import { Fragment, Suspense, useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { formatEther } from "viem";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import NotFoundPage from "../../not-found";

type Props = {
  targetPrizeAmount: bigint;
  durationInMinutes: bigint;
  entryFee: bigint;
  amountsOCW: bigint;
  rafflePrice: bigint;
  // raffleStatus: boolean;
};

const pageAdmin = () => {
  const { address } = useAccount();
  const account = useAccount();
  const { toast } = useToast();
  const [ethBalance, setEthBalance] = useState<any>("");
  const [targetPrizeAmount, setTargetPrizeAmount] = useState<any>("");
  const [durationInMinutes, setDurationInMinutes] = useState<any>("");
  const [entryFee, setEntryFee] = useState<any>("");

  const [ethFreeBalance, setEthFreeBalance] = useState<any>("");
  const [targetFreePrizeAmount, setFreeTargetPrizeAmount] = useState<any>("");
  const [durationInMinutesFree, setDurationInMinutesFree] = useState<any>("");

  const [ethFree3Balance, setEthFree3Balance] = useState<any>("");
  const [targetFree3PrizeAmount, setFree3TargetPrizeAmount] = useState<any>("");
  const [durationInMinutesFree3, setDurationInMinutesFree3] = useState<any>("");
  const [firstFree3, setFirstFree3] = useState<any>("");
  const [secondFree3, setSecondFree3] = useState<any>("");
  const [thirdFree3, setThirdFree3] = useState<any>("");

  const [ethTokenBalance, setEthTokenBalance] = useState<any>("");
  const [targetTokenPrizeAmount, setTargetTokenPrizeAmount] = useState<any>("");
  const [durationTokenInMinutes, setDurationTokenInMinutes] = useState<any>("");
  const [entryTokenFee, setEntryTokenFee] = useState<any>("");
  const [entryTokenUSDCFee, setEntryTokenUSDCFee] = useState<any>("");
  const [entryTokenUSDTFee, setEntryTokenUSDTFee] = useState<any>("");
  const [entryTokenRewardAddress, setEntryTokenRewardAddress] =
    useState<string>("");

  const {
    data: hash,
    isPending,
    writeContract,
    error,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Submitted.",
          duration: 3000,
        });
      },
      onError: (error) => {
        const partToShow = error.message.split("Contract Call:")[0].trim();
        toast({
          title: "OCW: Your transaction failed." + partToShow,
          duration: 5000,
        });
      },
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "You have successfully submitted",
        duration: 3000,
      });
      refetch();
      refetchFree();
      refetchFree3();
      refetchToken();
      refetchUSDCToken();
      refetchUSDTToken();
    }
  }, [isConfirmed, isConfirming]);

  // OCW 1

  const setupRaffle = async () => {
    writeContract({
      abi: A_PAIDTIMER_CONTRACT_ABI,
      address: A_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "setupRaffle",
      args: [
        BigInt(targetPrizeAmount),
        BigInt(durationInMinutes),
        BigInt(entryFee),
      ],
    });
  };

  const {
    data: contractBalance,
    isLoading: isLoadingtContractBalance,
    error: errortContractBalance,
    refetch,
  } = useReadContract({
    abi: A_PAIDTIMER_CONTRACT_ABI,
    address: A_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getContractBalance",
  });

  const cBalance = contractBalance ? BigInt(contractBalance as any) : BigInt(0);

  const cBalance2 = formatEther(cBalance);

  const initialDeposit = async () => {
    writeContract({
      abi: A_PAIDTIMER_CONTRACT_ABI,
      address: A_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "initialDeposit",
      value: BigInt(ethBalance),
    });
  };

  const withdrawBalance = async () => {
    writeContract({
      abi: A_PAIDTIMER_CONTRACT_ABI,
      address: A_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "withdrawBalance",
      value: BigInt(ethBalance),
    });
  };

  // OCWFREE

  const setupFreeRaffle = async () => {
    writeContract({
      abi: FREEOCW_CONTRACT_ABI,
      address: FREEOCW_CONTRACT_ADDRESS,
      account: address,
      functionName: "startRaffle",
      args: [BigInt(targetFreePrizeAmount), BigInt(durationInMinutesFree)],
    });
  };

  const {
    data: contractFreeBalance,
    isLoading: isLoadingFreeContractBalance,
    error: errorFreeContractBalance,
    refetch: refetchFree,
  } = useReadContract({
    abi: FREEOCW_CONTRACT_ABI,
    address: FREEOCW_CONTRACT_ADDRESS,
    functionName: "getContractBalance",
  });

  const cFreeBalance = contractFreeBalance
    ? BigInt(contractFreeBalance as any)
    : BigInt(0);

  const cFreeBalance2 = formatEther(cFreeBalance);

  const initialFreeDeposit = async () => {
    writeContract({
      abi: FREEOCW_CONTRACT_ABI,
      address: FREEOCW_CONTRACT_ADDRESS,
      account: address,
      functionName: "initialDeposit",
      value: BigInt(ethFreeBalance),
    });
  };

  const withdrawFreeBalance = async () => {
    writeContract({
      abi: FREEOCW_CONTRACT_ABI,
      address: FREEOCW_CONTRACT_ADDRESS,
      account: address,
      functionName: "withdrawFunds",
      value: BigInt(ethFreeBalance),
    });
  };

  // OCW FREE 3 Area

  const setupFree3Raffle = async () => {
    writeContract({
      abi: FREE3_CONTRACT_ABI,
      address: FREE3_CONTRACT_ADDRESS,
      account: address,
      functionName: "startRaffle",
      args: [
        BigInt(targetFree3PrizeAmount),
        BigInt(durationInMinutesFree3),
        BigInt(firstFree3),
        BigInt(secondFree3),
        BigInt(thirdFree3),
      ],
    });
  };

  const {
    data: contractFree3Balance,
    isLoading: isLoadingFree3ContractBalance,
    error: errorFree3ContractBalance,
    refetch: refetchFree3,
  } = useReadContract({
    abi: FREE3_CONTRACT_ABI,
    address: FREE3_CONTRACT_ADDRESS,
    functionName: "getContractBalance",
  });

  const cFree3Balance = contractFree3Balance
    ? BigInt(contractFree3Balance as any)
    : BigInt(0);

  const cFree3Balance2 = formatEther(cFree3Balance);

  const initialFree3Deposit = async () => {
    writeContract({
      abi: FREE3_CONTRACT_ABI,
      address: FREE3_CONTRACT_ADDRESS,
      account: address,
      functionName: "initialDeposit",
      value: BigInt(ethFree3Balance),
    });
  };

  const withdrawFree3Balance = async () => {
    writeContract({
      abi: FREE3_CONTRACT_ABI,
      address: FREE3_CONTRACT_ADDRESS,
      account: address,
      functionName: "withdrawFunds",
      value: BigInt(ethFree3Balance),
    });
  };

  // OCW TOKEN Area

  const setupTokenRaffle = async () => {
    writeContract({
      abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "setupRaffle",
      args: [
        BigInt(targetTokenPrizeAmount),
        BigInt(durationTokenInMinutes),
        BigInt(entryTokenFee),
        BigInt(entryTokenUSDCFee),
        BigInt(entryTokenUSDTFee),
        entryTokenRewardAddress,
      ],
    });
  };

  const {
    data: contractTokenETHBalance,
    isLoading: isLoadingTokenContractBalance,
    error: errorTokenContractBalance,
    refetch: refetchToken,
  } = useReadContract({
    abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getContractETHBalance",
  });

  const cTokenBalance = contractTokenETHBalance
    ? BigInt(contractTokenETHBalance as any)
    : BigInt(0);

  const cTokenBalance2 = formatEther(cTokenBalance);

  const {
    data: contractTokenUSDCBalance,
    isLoading: isLoadingTokenUSDCContractBalance,
    error: errorTokenUSDCContractBalance,
    refetch: refetchUSDCToken,
  } = useReadContract({
    abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getUSDCBalance",
  });

  const cTokenBalanceUSDC = contractTokenUSDCBalance
    ? BigInt(contractTokenUSDCBalance as any)
    : BigInt(0);

  const cTokenBalanceUSDCNumber = Number(cTokenBalanceUSDC); // BigInt değerini number'a dönüştür

  // Ardından number türündeki değeri bölme işlemini gerçekleştirin
  const cTokenBalanceUSDC3 = cTokenBalanceUSDCNumber / 1000000;

  const {
    data: contractTokenUSDTBalance,
    isLoading: isLoadingTokenUSDTContractBalance,
    error: errorTokenUSDTContractBalance,
    refetch: refetchUSDTToken,
  } = useReadContract({
    abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getUSDTBalance",
  });

  const cTokenBalanceUSDT = contractTokenUSDTBalance
    ? BigInt(contractTokenUSDTBalance as any)
    : BigInt(0);

  const cTokenBalanceUSDTNumber = Number(cTokenBalanceUSDT); // BigInt değerini number'a dönüştür

  // Ardından number türündeki değeri bölme işlemini gerçekleştirin
  const cTokenBalanceUSDT3 = cTokenBalanceUSDTNumber / 1000000;

  const {
    data: contractTokenRewardBalance,
    isLoading: isLoadingTokenRewardContractBalance,
    error: errorTokenRewardContractBalance,
    refetch: refetchRewardToken,
  } = useReadContract({
    abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "isThereRewardBalance",
  });

  const cTokenBalanceReward = contractTokenRewardBalance
    ? BigInt(contractTokenRewardBalance as any)
    : BigInt(0);

  const cTokenBalanceReward2 = formatEther(cTokenBalanceReward);

  const {
    data: getRewardToken,
    isLoading: isLoadinggetRewardToken,
    error: errorgetRewardToken,
    refetch: refetchGetRewardToken,
  } = useReadContract({
    abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
    address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
    functionName: "getRewardToken",
  });

  const initialTokenDeposit = async () => {
    writeContract({
      abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "initialDeposit",
      value: BigInt(ethTokenBalance),
    });
  };

  const withdrawTokenBalance = async () => {
    writeContract({
      abi: TOKEN_PAIDTIMER_CONTRACT_ABI,
      address: TOKEN_PAIDTIMER_CONTRACT_ADDRESS,
      account: address,
      functionName: "withdrawBalance",
      value: BigInt(ethTokenBalance),
    });
  };

  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <div className="lg:flex hidden mr-10 absolute">
          <Sidebar />
        </div>
        {account.address !== "0x0C81eAb0896b32AAB44175872462cC4126AaB0F7" ? (
          <NotFoundPage />
        ) : (
          <div className="p-5 w-full md:pl-20 h-full justify-center items-center text-center">
            <Link href={"/ocw"} className="m-5">
              <Button variant={"outline"}>OCW Çekiliş Alanı</Button>
            </Link>
            <Link href={"/freeocw"} className="m-5">
              <Button variant={"outline"}>OCW Free Çekiliş Alanı</Button>
            </Link>
            <Link
              href="https://eth-converter.com"
              target="_blank"
              className="m-5">
              <Button variant={"secondary"}>Eth Converter</Button>
            </Link>
            <div className="justify-between flex max-md:flex-col border-b-2 p-4 gap-5">
              <div className="flex-row w-1/2 max-md:flex-col max-md:w-full">
                <h1>OCW Otomatik</h1>
                <div className="space-y-4 border p-2 w-full rounded-lg">
                  <h2 className="mt-2  rounded-lg p-2">
                    1. ve 3. seçenek WEI Cinsinden olmalıdır
                  </h2>
                  <input
                    type="number"
                    value={targetPrizeAmount}
                    onChange={(e) =>
                      setTargetPrizeAmount(parseInt(e.target.value))
                    }
                    placeholder="Toplanacak ETH Miktarı"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={durationInMinutes}
                    onChange={(e) =>
                      setDurationInMinutes(parseInt(e.target.value))
                    }
                    placeholder="Çekilişin Süresi (Dakika)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(parseInt(e.target.value))}
                    placeholder="Bilet Fiyatı (ETH)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  {address ? (
                    <Fragment>
                      <Button
                        className="justify-end"
                        onClick={() => {
                          setupRaffle();
                        }}
                        variant={"outline"}>
                        Çekilişi Başlat
                      </Button>
                    </Fragment>
                  ) : (
                    <p className="text-red-500">
                      Please connect wallet to use buttons.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-row w-1/2 max-md:flex-col max-md:mt-5 max-md:w-full">
                Kontrattaki Para
                <div className="text-left flex flex-col font-mono">
                  <h2 className="italic">
                    WEI Cinsinden: {contractBalance?.toString()}
                  </h2>
                  <h2 className="font-bold">ETH Cinsinden: {cBalance2}</h2>
                  {/* <h3 className="font-light text-sm">{!raffleStatus ? "Active" : "Inactive"}</h3> */}
                </div>
                <h3 className="mt-5">OCW Bakiye Yükleme Alanı</h3>
                <input
                  className="mt-6 w-full text-center border-2 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  placeholder="Kontrata Yüklenecek Eth Miktarı"
                  // readOnly
                  value={ethBalance}
                  onChange={(e) => setEthBalance(parseInt(e.target.value))}
                />
                <Button
                  className="mt-2"
                  variant={"outline"}
                  onClick={() => {
                    initialDeposit();
                  }}>
                  Yükle
                </Button>
                <div className="mt-14 py-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      withdrawBalance();
                    }}>
                    Bakiyeyi Çek
                  </Button>
                </div>
              </div>
            </div>

            {/* Free OCW alanı */}
            <div className="w-full h-full p-4 bg-slate-500 rounded-full mt-5" />
            <div className="justify-between flex max-md:flex-col border-t-2 mt-5 p-4 gap-5">
              <div className="flex-col flex justify-around w-1/2 max-md:flex-col max-md:w-full ">
                <h1 className="">OCW FREE Otomatik</h1>
                <div className="space-y-4 border p-2 w-full rounded-lg">
                  <h2 className="rounded-lg p-2">
                    Ödül miktar WEI cinsinden olmalıdır.
                  </h2>
                  <input
                    type="number"
                    value={targetFreePrizeAmount}
                    onChange={(e) =>
                      setFreeTargetPrizeAmount(parseInt(e.target.value))
                    }
                    placeholder="Ödül Miktarı (ETH)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={durationInMinutesFree}
                    onChange={(e) =>
                      setDurationInMinutesFree(parseInt(e.target.value))
                    }
                    placeholder="Çekilişin Süresi (Dakika)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />

                  {address ? (
                    <Fragment>
                      <Button
                        className="justify-end"
                        onClick={() => {
                          setupFreeRaffle();
                        }}
                        variant={"outline"}>
                        Çekilişi Başlat
                      </Button>
                    </Fragment>
                  ) : (
                    <p className="text-red-500">
                      Please connect wallet to use buttons.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-row w-1/2 max-md:flex-col max-md:mt-5 max-md:w-full">
                Kontrattaki Para
                <div className="text-left flex flex-col font-mono">
                  <h2 className="italic">
                    WEI Cinsinden: {contractFreeBalance?.toString()}
                  </h2>
                  <h2 className="font-bold">ETH Cinsinden: {cFreeBalance2}</h2>
                  {/* <h3 className="font-light text-sm">{!raffleStatus ? "Active" : "Inactive"}</h3> */}
                </div>
                <h3 className="mt-5">OCW Free Bakiye Yükleme Alanı</h3>
                <input
                  className="mt-6 w-full text-center border-2 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  placeholder="Kontrata Yüklenecek Eth Miktarı"
                  // readOnly
                  value={ethFreeBalance}
                  onChange={(e) => setEthFreeBalance(parseInt(e.target.value))}
                />
                <Button
                  className="mt-2"
                  variant={"outline"}
                  onClick={() => {
                    initialFreeDeposit();
                  }}>
                  Yükle
                </Button>
                <div className="mt-9 py-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      withdrawFreeBalance();
                    }}>
                    Bakiyeyi Çek
                  </Button>
                </div>
              </div>
            </div>

            {/* OCW FREE 3  */}
            <div className="w-full h-full p-4 bg-slate-500 rounded-full mt-5" />
            <div className="justify-between flex max-md:flex-col border-t-2 mt-5 p-4 gap-5">
              <div className="flex-col flex justify-around w-1/2 max-md:flex-col max-md:w-full ">
                <h1 className="">OCW FREE 3 Otomatik</h1>
                <div className="space-y-4 border p-2 w-full rounded-lg">
                  <h2 className="rounded-lg p-2">
                    Ödül miktar WEI cinsinden olmalıdır.
                  </h2>
                  <input
                    type="number"
                    value={targetFree3PrizeAmount}
                    onChange={(e) =>
                      setFree3TargetPrizeAmount(parseInt(e.target.value))
                    }
                    placeholder="Ödül Miktarı (ETH)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={durationInMinutesFree3}
                    onChange={(e) =>
                      setDurationInMinutesFree3(parseInt(e.target.value))
                    }
                    placeholder="Çekilişin Süresi (Dakika)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={firstFree3}
                    onChange={(e) => setFirstFree3(parseInt(e.target.value))}
                    placeholder="1. ödül oranı"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={secondFree3}
                    onChange={(e) => setSecondFree3(parseInt(e.target.value))}
                    placeholder="2. Ödül oranı"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={thirdFree3}
                    onChange={(e) => setThirdFree3(parseInt(e.target.value))}
                    placeholder="3. Ödül oranı"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />

                  {address ? (
                    <Fragment>
                      <Button
                        className="justify-end"
                        onClick={() => {
                          setupFree3Raffle();
                        }}
                        variant={"outline"}>
                        Çekilişi Başlat
                      </Button>
                    </Fragment>
                  ) : (
                    <p className="text-red-500">
                      Please connect wallet to use buttons.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-row w-1/2 max-md:flex-col max-md:mt-5 max-md:w-full">
                Kontrattaki Para
                <div className="text-left flex flex-col font-mono">
                  <h2 className="italic">
                    WEI Cinsinden: {contractFree3Balance?.toString()}
                  </h2>
                  <h2 className="font-bold">ETH Cinsinden: {cFree3Balance2}</h2>
                  {/* <h3 className="font-light text-sm">{!raffleStatus ? "Active" : "Inactive"}</h3> */}
                </div>
                <h3 className="mt-5">OCW Free 3 Bakiye Yükleme Alanı</h3>
                <input
                  className="mt-6 w-full text-center border-2 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  placeholder="Kontrata Yüklenecek Eth Miktarı"
                  // readOnly
                  value={ethFree3Balance}
                  onChange={(e) => setEthFree3Balance(parseInt(e.target.value))}
                />
                <Button
                  className="mt-2"
                  variant={"outline"}
                  onClick={() => {
                    initialFree3Deposit();
                  }}>
                  Yükle
                </Button>
                <div className="mt-9 py-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      withdrawFree3Balance();
                    }}>
                    Bakiyeyi Çek
                  </Button>
                </div>
              </div>
            </div>

            {/* OCW Token  */}

            <div className="w-full h-full p-4 bg-slate-500 rounded-full mt-5" />
            <div className="justify-between flex max-md:flex-col border-t-2 mt-5 p-4 gap-5">
              <div className="flex-col flex justify-around w-1/2 max-md:flex-col max-md:w-full ">
                <h1 className="">OCW Token Otomatik</h1>
                <div className="space-y-4 border p-2 w-full rounded-lg">
                  <h2 className="rounded-lg p-2">
                    Ödül miktar ETH için WEI, Diğerleri için 000000 cinsinden
                    olmalıdır.
                  </h2>
                  <input
                    type="number"
                    value={targetTokenPrizeAmount}
                    onChange={(e) =>
                      setTargetTokenPrizeAmount(parseInt(e.target.value))
                    }
                    placeholder="Ödül Miktarı (1 = 1000000)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />

                  <input
                    type="number"
                    value={durationTokenInMinutes}
                    onChange={(e) =>
                      setDurationTokenInMinutes(parseInt(e.target.value))
                    }
                    placeholder="Çekilişin Süresi (Dakika)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />

                  <input
                    type="number"
                    value={entryTokenFee}
                    onChange={(e) => setEntryTokenFee(parseInt(e.target.value))}
                    placeholder="Bilet Fiyatı (ETH - Wei Cinsinden)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />

                  <input
                    type="number"
                    value={entryTokenUSDCFee}
                    onChange={(e) =>
                      setEntryTokenUSDCFee(parseInt(e.target.value))
                    }
                    placeholder="Bilet Fiyatı (USDC) (1 = 1000000)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="number"
                    value={entryTokenUSDTFee}
                    onChange={(e) =>
                      setEntryTokenUSDTFee(parseInt(e.target.value))
                    }
                    placeholder="Bilet Fiyatı (USDT) (1 = 1000000)"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="string"
                    value={entryTokenRewardAddress}
                    onChange={(e) => setEntryTokenRewardAddress(e.target.value)}
                    placeholder="Ödül Token Adresi"
                    className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400"
                  />

                  {address ? (
                    <Fragment>
                      <Button
                        className="justify-end"
                        onClick={() => {
                          setupTokenRaffle();
                        }}
                        variant={"outline"}>
                        Çekilişi Başlat
                      </Button>
                    </Fragment>
                  ) : (
                    <p className="text-red-500">
                      Please connect wallet to use buttons.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-row w-1/2 max-md:flex-col max-md:mt-5 max-md:w-full ">
                Kontrattaki Para
                <div className=" border rounded-xl p-6 justify-between items-center text-center self-center bg-centertext-left flex flex-col font-mono">
                  <h2 className="italic">
                    WEI Cinsinden ETH: {contractTokenETHBalance?.toString()}
                  </h2>
                  <h2 className="font-bold">ETH Cinsinden: {cTokenBalance2}</h2>
                  <h2 className="font-bold">
                    USDC Miktarı: {cTokenBalanceUSDC3}
                  </h2>
                  <h2 className="font-bold">
                    USDT Miktarı: : {cTokenBalanceUSDT3}
                  </h2>
                  <h2 className="font-bold">
                    Ödül Tokeni Adedi: {cTokenBalanceReward2}
                  </h2>
                  <Link
                    href={`https://scrollscan.com/address/${getRewardToken}`}
                    target="_blank"
                    className="border-t mt-2 text-orange-400">
                    <p>
                      Benim üstüme tıklarsanız ödül tokenin kontratına gönderir.
                    </p>
                    <p>Ödül Token Adresi: {getRewardToken as any}</p>
                  </Link>
                  {/* <h3 className="font-light text-sm">{!raffleStatus ? "Active" : "Inactive"}</h3> */}
                </div>
                <h3 className="mt-5">OCW TokenPaid ETH Yükleme Alanı</h3>
                <input
                  className="mt-6 w-full text-center border-2 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  placeholder="Kontrata Yüklenecek Eth Miktarı"
                  // readOnly
                  value={ethTokenBalance}
                  onChange={(e) => setEthTokenBalance(parseInt(e.target.value))}
                />
                <Button
                  className="mt-2"
                  variant={"outline"}
                  onClick={() => {
                    initialTokenDeposit();
                  }}>
                  Yükle
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    withdrawTokenBalance();
                  }}>
                  Bakiyeyi Çek
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default pageAdmin;
