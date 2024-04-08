import { checkForListens } from "@/features/listens/utils";
import { useState } from "react";

export const useListenData = () => {
  const [isFetchingListens, setIsFetchingListens] = useState(false);

  const getListens = async () => {
    if (isFetchingListens) {
      return;
    }
    setIsFetchingListens(true);
    await checkForListens();
    console.log(`Finished Refreshing Listens`);
    setIsFetchingListens(false);
  };
  return { isFetchingListens, getListens };
};
