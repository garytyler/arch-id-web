import { Box, Link, Typography } from "@material-ui/core";
import "./App.css";
import { AUTHOR_NAME, AUTHOR_URL } from "./env";
import "./index.css";

export default function Copyright() {
  return (
    <Box margin={1}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href={AUTHOR_URL}>
          {AUTHOR_NAME}
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
}
