"use client";

import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const { openLoadingIndicator } = useLoadingIndicatorToggler();
  return (
    <Box display="inline-block">
      <Typography
        onClick={openLoadingIndicator}
        component={Link}
        prefetch={false}
        href={href}
        display="flex"
        alignItems="center"
        columnGap={1}
        color="primary"
        sx={{
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        <ArrowBackIcon />
        {children}
      </Typography>
    </Box>
  );
}
