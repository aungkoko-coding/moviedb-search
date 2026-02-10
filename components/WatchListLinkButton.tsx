"use client";
import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import useWatchList from "@/utils/custom-hooks/useWatchList";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Badge, IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WatchListLinkButton() {
  const { watchList } = useWatchList();
  const pathname = usePathname();
  const { openLoadingIndicator } = useLoadingIndicatorToggler();
  const totalItemsInWatchList =
    watchList && Object.values(watchList).flat().length;

  const handleClick = () => {
    !pathname.startsWith("/watchlist") && openLoadingIndicator();
  };

  return (
    <IconButton LinkComponent={Link} href="/watchlist" onClick={handleClick}>
      <Badge badgeContent={totalItemsInWatchList || 0} color="primary">
        <BookmarkIcon />
      </Badge>
    </IconButton>
  );
}
