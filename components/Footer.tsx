"use client";
import GmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GithubIcon from "@mui/icons-material/GitHub";
import { Box, Container, Link, Paper, Stack, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Paper
      component="footer"
      elevation={0}
      sx={{ mt: "auto", borderTop: 2, borderTopColor: "background.default" }}
    >
      <Container>
        <Box py={2}>
          <Typography textAlign="center" variant="body2">
            &#169; 2023 Aung Ko Ko. All rights reserved!
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Link
              component="a"
              href="https://github.com/aungkoko-coding"
              color="text.primary"
              target="_blank"
            >
              <GithubIcon />
            </Link>
            <Link
              component="a"
              href="https://www.facebook.com/profile.php?id=100042812481237"
              color="text.primary"
              target="_blank"
            >
              <FacebookIcon />
            </Link>
            <Link href="mailto: webdev.aungkoko@gmail.com" color="text.primary">
              <GmailIcon />
            </Link>
          </Stack>
        </Box>
      </Container>
    </Paper>
  );
}
