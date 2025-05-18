// useEffect(() => {
//     const getAllEvents = async () => {
//       await FOCWEvents();
//       await FOCWWEvents();
//       await giveawayNewHash();
//     };

//     if (isConfirmed) {
//       toast({
//         title: "You have successfully bought a ticket!",
//         duration: 3000,
//       });

// Bu alan

//       // (async () => {
//       //   try {
//       //     const response = await fetch("/api/saveticket", {
//       //       method: "POST",
//       //       headers: {
//       //         "content-type": "application/json",
//       //       },
//       //       body: JSON.stringify({
//       //         wallet: address,
//       //         raffeltype: "Free",
//       //         ticketcount: 1 as number,
//       //         time: new Date(),
//       //         hash: hash,
//       //         giveawayhash: "test1",
//       //         network: network,
//       //       }),
//       //     });
//       //   } catch (error) {
//       //     console.log(error);
//       //   }
//       // })();

//////////////////

//       refetch();
//       refetchMin();
//       refetchStatus();
//       refetchTicket();
//       getAllEvents();
//     }
//   }, [isConfirmed, isConfirming]);